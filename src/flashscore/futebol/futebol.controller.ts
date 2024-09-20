import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { FlashscoreService } from '../flashscore.service';

@Controller('flashscore/futebol')
export class FutebolController {
  constructor(private readonly flashscoreService: FlashscoreService) {}

  @Get('result')
  async getFutebol(@Res() res: Response) {
    try {
      const matchData = await this.flashscoreService.getFutebol(); 
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(matchData);
    } catch (error) {
      res.status(500).send({ error: 'Erro ao buscar dados de futebol' });
    }
  }
}
