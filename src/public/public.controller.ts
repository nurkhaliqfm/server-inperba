import { Controller, Get, Headers, Ip, Query, Req } from '@nestjs/common';
import { PublicService } from './public.service';
import { Request } from 'express';

@Controller('/api/public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Get('/ref-lokasi')
  async getListLokasi() {
    const result = await this.publicService.lokasi();
    return result;
  }

  @Get('/counter')
  async hitCounter(
    @Headers('authorization') authorization: string,
    @Headers('user-agent') useragent: string,
    @Ip() ip: string,
    @Req() req: Request,
  ) {
    const result = await this.publicService.counter(
      authorization,
      ip,
      useragent,
      req.originalUrl,
    );
    return result;
  }

  @Get('/repository/rekomendasi')
  async getRekomendasi(
    @Query('repos') repos: string,
    @Query('limit') limit: string,
  ) {
    const result = await this.publicService.rekomendasi(Number(limit), repos);
    return result;
  }
}
