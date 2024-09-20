import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { MatchDataDto } from './dtos/match-data.dto';
import { ScrapingService } from './scraping/scraping.service';
import puppeteer from 'puppeteer';

@Injectable()
export class FlashscoreService {
  private matchDataSubject = new Subject<MatchDataDto>();

  constructor(private readonly scrapingService: ScrapingService) {}

  async getFutebol(): Promise<Observable<MatchDataDto>> {
    let browser;
    try {
      console.log('Launching browser...');
      browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      
      const matchIdList = await this.scrapingService.getMatchIdList(page);
      
      console.log(`Found match IDs: ${matchIdList.length}`);

      for (const matchId of matchIdList) {
        console.log(`Fetching data for match ID: ${matchId}`);
        const matchData = await this.scrapingService.getMatchData(page, matchId);
        console.log(`Data fetched for match ID ${matchId}:`, matchData);
        this.matchDataSubject.next(matchData);
      }

      this.matchDataSubject.complete();
    } catch (error) {
      console.error('Error scraping:', error);
      this.matchDataSubject.error('Erro ao fazer scraping dos times');
    } finally {
      if (browser) {
        await browser.close();
        
        console.log('Browser closed');
      }
    }
    return this.matchDataSubject.asObservable();
  }
}
