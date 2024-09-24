import { Injectable } from '@nestjs/common';
import { ScrapingService } from './scraping/scraping.service';
import puppeteer from 'puppeteer';
import { MatchDataDto } from './futebol/dtos/match-data.dto';

@Injectable()
export class FlashscoreService {

  constructor(private readonly scrapingService: ScrapingService) {}

  async getFutebol(): Promise<MatchDataDto[]> {
    let browser;
    const matchDataList: MatchDataDto[] = [];

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      const matchIdList = await this.scrapingService.getMatchIdList(page);
      
      for (const matchId of matchIdList) {
        const matchData = await this.scrapingService.getMatchData(page, matchId);
        matchDataList.push(matchData);
        return matchDataList;
      }

    } catch (error) {
      throw new Error('Erro ao fazer scraping dos times');
    } finally {
      if (browser) {
        await browser.close();
      }
    }

    return matchDataList;
  }
}
