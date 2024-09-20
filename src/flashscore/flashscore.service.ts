import { Injectable } from '@nestjs/common';
import { MatchDataDto } from './dtos/match-data.dto';
import { ScrapingService } from './scraping/scraping.service';
import puppeteer from 'puppeteer';

@Injectable()
export class FlashscoreService {

  constructor(private readonly scrapingService: ScrapingService) {}

  async getFutebol(): Promise<MatchDataDto[]> {
    let browser;
    const matchDataList: MatchDataDto[] = []; // Armazenar os dados de todas as partidas

    try {
      console.log('Launching browser...');
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      const matchIdList = await this.scrapingService.getMatchIdList(page);

      console.log(`Found match IDs: ${matchIdList.length}`);

      for (const matchId of matchIdList) {
        console.log(`Fetching data for match ID: ${matchId}`);
        const matchData = await this.scrapingService.getMatchData(page, matchId);
        console.log(`Data fetched for match ID ${matchId}:`, matchData);
        matchDataList.push(matchData); // Adiciona os dados à lista
        return matchDataList;
      }

    } catch (error) {
      console.error('Error scraping:', error);
      throw new Error('Erro ao fazer scraping dos times');
    } finally {
      if (browser) {
        await browser.close();
        console.log('Browser closed');
      }
    }

    return matchDataList; // Retorna a lista de dados de partidas
  }
}
