import { Module } from '@nestjs/common';
import { FutebolController } from './futebol.controller';
import { FlashscoreService } from '../flashscore.service';
import { ScrapingService } from '../scraping/scraping.service';
import { ClickService } from '../scraping/click.service';

@Module({
  controllers: [FutebolController],
  providers: [FlashscoreService,ScrapingService,ClickService]
})
export class FlashscoreModule {}
