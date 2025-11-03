import { Controller, Get, Headers, Query } from '@nestjs/common';
import { PublicService } from './public.service';

@Controller('/api/public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Get('/perkara-detail')
  async detailPerkara(
    @Query('perkara') perkara: string,
    @Headers('authorization') identity: string,
  ) {
    const result = await this.publicService.detail(identity, perkara);
    return result;
  }

  @Get('/perkara-statistik')
  async statistikPerkara() {
    const result = await this.publicService.statistik();
    return result;
  }
}
