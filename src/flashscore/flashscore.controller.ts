import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { FlashscoreService } from './flashscore.service';

@Controller('flashscore')
export class FlashscoreController {
  constructor(private readonly flashscoreService: FlashscoreService) {}

  @Get('futebol')
  async getFutebol(@Res() res: Response) {
    const observable = await this.flashscoreService.getFutebol();

    res.setHeader('Content-Type', 'application/json');
    res.write('['); // Inicia um array JSON

    observable.subscribe({
      next: (data) => {
        res.write(JSON.stringify(data) + ','); // Envia os dados conforme eles são emitidos
      },
      complete: () => {
        res.write(']'); // Fecha o array JSON
        res.end();
      },
      error: (err) => {
        res.status(500).send({ error: err });
      },
    });
  }
}
