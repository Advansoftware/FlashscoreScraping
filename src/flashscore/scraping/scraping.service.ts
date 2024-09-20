import { Injectable } from '@nestjs/common';
import { ClickService } from './click.service'; // Ajuste o caminho conforme necessário

@Injectable()
export class ScrapingService {
  constructor(private readonly clickService: ClickService) {}

  async getMatchIdList(page): Promise<string[]> {
    const url = `https://www.flashscore.com/football/brazil/serie-a/results/`;
    console.log(`Navigating to ${url}`);
    await page.goto(url);
    console.log('Accepting cookies...');
    await this.clickService.clickElementIfExists(page, "#onetrust-accept-btn-handler");
    await this.clickService.customClick(page, "a.event__more.event__more--static");

    console.log('Fetching match IDs from the page...');
    const matchIdList = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll(".event__match.event__match--static.event__match--twoLine")
      ).map((element) => element?.id?.replace("g_1_", ""));
    });

    return matchIdList;
  }

  async getOldsData(page, matchId): Promise<any[]> {
    const url = `https://www.flashscore.com/match/${matchId}/#/odds-comparison`;
    console.log(`Navigating to ${url}`);
    await page.goto(url);
    page.on('console', msg => {
      console.log('PAGE LOG:', msg.text());
    }); 

    // Espera um pouco para o conteúdo carregar
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const debug = await page.$$('.ui-table__row ');
    console.log(`Found ${debug.length} elements`);

    const olds = await page.evaluate(() => {
      const oddsData: Record<string, any[]> = {};
      // Captura todos os sites de apostas
      const bettingSites = Array.from(document.querySelectorAll('.ui-table__row .oddsCell__bookmaker .prematchLink'));
      const oddsRows = Array.from(document.querySelectorAll('.ui-table__row')); 

      if (bettingSites.length === 0 || oddsRows.length === 0) {
        console.warn('No betting sites or odds rows found.');
      }
      oddsRows.forEach(row => {
        const site = row.querySelector('.ui-table__row .oddsCell__bookmaker').querySelector('a')?.title || null;
        const image = row.querySelector('.ui-table__row .oddsCell__bookmaker').querySelector('img')?.src || null;
        if (site) {
          const odds = Array.from(row.querySelectorAll('.oddsCell__odd')).map(odd => {
            const oddElement = odd as HTMLElement; // Asserção de tipo
            return { 
              value: oddElement.textContent.trim()
            };

          }); 

          if (!oddsData[site]) {
            oddsData[site] = [];
          }
          oddsData[site].push({ image, ...odds});
        }
      });
      return oddsData;
    });
    return olds;
  }

  async getMatchData(page, matchId): Promise<any> {
    const url = `https://www.flashscore.com/match/${matchId}/#/match-summary/match-statistics/0`;
    console.log(`Navigating to ${url}`);
    await page.goto(url);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Coletando dados de odds
    const oldsData = await this.getOldsData(page, matchId);
    // Coletando dados da partida
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
        bettingInfo: oldsData[homeTeamName] || [], // Adicionando odds ao time da casa
      },
      [awayTeamName]: {
        goals: awayGoals,
        bettingInfo: oldsData[awayTeamName] || [], // Adicionando odds ao time visitante
      },
    };
  }
}
