import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { PublicService } from './public.service';
import { PerkaraRequest } from 'src/model/perkara.model';

@Controller('/api/public')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Get('/perkaras')
  async getPerkaraPagination(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    console.log(page, limit);
    const result = await this.publicService.pagination({
      keyword: keyword,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    return result;
  }

  @Post('/perkara/create')
  async createPerkara(@Body() request: { data: PerkaraRequest }) {
    const { data } = request;
    const result = await this.publicService.create(data);
    return result;
  }

  @Get('/perkara-detail')
  async detailPerkara(
    @Query('perkara') perkara: string,
    @Headers('authorization') identity: string,
  ) {
    const result = await this.publicService.detail(identity, perkara);
    return result;
  }
}
