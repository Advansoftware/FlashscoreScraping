import { Module } from '@nestjs/common';
import { FlashscoreController } from './flashscore.controller';
import { FlashscoreService } from './flashscore.service';
import { ScrapingService } from './scraping/scraping.service';
import { ClickService } from './scraping/click.service';

@Module({
  controllers: [FlashscoreController],
  providers: [FlashscoreService,ScrapingService,ClickService]
})
export class FlashscoreModule {}
