import { Controller, Get, Headers, Ip, Query, Req } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('/api/public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Get('/perkara')
  async detailBuku(@Query('repos') id: string) {
    const result = await this.publicService.perkara();
    return result;
  }
}
