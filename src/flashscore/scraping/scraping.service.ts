import { Injectable } from '@nestjs/common';
import { ClickService } from './click.service';

@Injectable()
export class ScrapingService {
  constructor(private readonly clickService: ClickService) {}

  // lista de IDs das partidas
  async getMatchIdList(page): Promise<string[]> {
    const url = `https://www.flashscore.com/football/brazil/serie-a-betano/results/`;
    await page.goto(url);
    await this.clickService.clickElementIfExists(page, "#onetrust-accept-btn-handler");
    await this.clickService.customClick(page, "a.event__more.event__more--static");
    const matchIdList = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".event__match.event__match--static.event__match--twoLine")
      ).map((element) => element?.id?.replace("g_1_", ""));
    });

    return matchIdList;
  }

  // odds para cada partida
  async getOldsData(page, matchId): Promise<any[]> {
    const url = `https://www.flashscore.com/match/${matchId}/#/odds-comparison`;
    await page.goto(url);

    // espera um pouco para o conteúdo carregar
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const olds = await page.evaluate(() => {
      const oddsData: Record<string, any[]> = {};
      const oddsRows = Array.from(document.querySelectorAll('.ui-table__row'));

      if (oddsRows.length === 0) {
        console.warn('Nenhuma old encontrada.');
      }

      oddsRows.forEach((row) => {
        const site = row.querySelector('.oddsCell__bookmaker').querySelector("a")?.title || null;
        const image = row.querySelector('.oddsCell__bookmaker ').querySelector("img")?.src || null;

        if (site) {
          const odds = Array.from(row.querySelectorAll('.oddsCell__odd')).map((odd) => {
            const oddElement = odd as HTMLElement;
            return {
              value: oddElement.textContent.trim(),
            };
          });

          if (!oddsData[site]) {
            oddsData[site] = [];
          }

          oddsData[site].push({
            odds: odds,
            image: image,
          });
        }
      });

      return oddsData;
    });
    return olds;
  }

  // dados da partida, incluindo as odds
  async getMatchData(page, matchId): Promise<any> {
    const url = `https://www.flashscore.com/match/${matchId}/#/match-summary/match-statistics/0`;
    await page.goto(url);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // dados de odds
    const oldsData = await this.getOldsData(page, matchId);
    // dados da partida
    const data = await page.evaluate(() => {
      const homeTeamElement = document.querySelector(".duelParticipant__home .participant__participantName");
      const awayTeamElement = document.querySelector(".duelParticipant__away .participant__participantName");

      const homeTeamName = homeTeamElement ? homeTeamElement.textContent : 'Unknown Home Team';
      const awayTeamName = awayTeamElement ? awayTeamElement.textContent : 'Unknown Away Team';

      const homeGoals = Array.from(document.querySelectorAll(".detailScore__wrapper span:not(.detailScore__divider)"))[0]?.textContent || '0';
      const awayGoals = Array.from(document.querySelectorAll(".detailScore__wrapper span:not(.detailScore__divider)"))[1]?.textContent || '0';

      return {
        homeTeamName,
        awayTeamName,
        homeGoals: parseInt(homeGoals, 10),
        awayGoals: parseInt(awayGoals, 10),
      };
    });

    const { homeTeamName, awayTeamName, homeGoals, awayGoals } = data;
    return {
      [homeTeamName]: {
        goals: homeGoals,
      },
      [awayTeamName]: {
        goals: awayGoals,
      },
      olds: oldsData
    };
  }
}

