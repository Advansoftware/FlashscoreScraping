import { Module } from '@nestjs/common';
import { FlashscoreModule } from './flashscore/flashscore.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    FlashscoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
