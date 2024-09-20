import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { FlashscoreService } from './flashscore.service';

@Controller('flashscore')
export class FlashscoreController {
  constructor(private readonly flashscoreService: FlashscoreService) {}

  @Get('futebol')
  async getFutebol(@Res() res: Response) {
    try {
      const matchData = await this.flashscoreService.getFutebol(); // Obtém os dados como um array de Promise
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(matchData); // Retorna os dados diretamente como JSON
    } catch (error) {
      res.status(500).send({ error: 'Erro ao buscar dados de futebol' }); // Lida com erros e retorna status 500
    }
  }
}
