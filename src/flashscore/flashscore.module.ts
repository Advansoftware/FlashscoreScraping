import { Module } from '@nestjs/common';
import { FlashscoreService } from './flashscore.service';
import { ScrapingService } from './scraping/scraping.service';
import { ClickService } from './scraping/click.service';
import { FutebolController } from './futebol/futebol.controller';

@Module({
  controllers: [FutebolController],
  providers: [FlashscoreService, ClickService, ScrapingService]
})
export class FlashscoreModule {}
