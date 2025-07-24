import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { TransaksiRequest } from 'src/model/transaksi.model';

@Controller('/api/admin/transaksi')
export class TransaksiController {
  constructor(private transaksiService: TransaksiService) {}

  @Post('/create-many')
  async createManyTransaksi(@Body() request: TransaksiRequest) {
    const result = await this.transaksiService.createMany(request);
    return result;
  }

  @Post('/create')
  async createTransaksi(@Body() request: TransaksiRequest) {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const result = await this.transaksiService.create({
      ...request,
      status: 'BORROWED',
      brrowedAt: today,
      returnedAt: nextWeek,
    });
    return result;
  }

  @Get('/delete')
  async deleteTransaksi(@Query('transaksi') id: string) {
    const result = await this.transaksiService.delete(Number(id));
    return result;
  }

  @Patch('/update')
  async updateTransaksi(
    @Query('transaksi') id: string,
    @Body() request: TransaksiRequest,
  ) {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const result = await this.transaksiService.update(Number(id), {
      ...request,
      status: 'BORROWED',
      brrowedAt: today,
      returnedAt: nextWeek,
    });
    return result;
  }

  @Patch('/returned')
  async returnRepository(
    @Query('transaksi') id: string,
    @Body() request: TransaksiRequest,
  ) {
    const result = await this.transaksiService.returned(Number(id), {
      ...request,
      status: 'RETURNED',
    });
    return result;
  }

  @Patch('/extended')
  async extendRepository(
    @Query('transaksi') id: string,
    @Body() request: TransaksiRequest,
  ) {
    const result = await this.transaksiService.extended(Number(id), {
      ...request,
      status: 'BORROWED',
    });
    return result;
  }

  @Get('/list')
  async paginationTransaksi(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('slug') slug: string,
  ) {
    const result = await this.transaksiService.pagination({
      keyword: keyword,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      slug: slug ? slug : 'BORROWED',
    });
    return result;
  }

  @Get('/detail')
  async detailTransaksi(@Query('transaksi') id: string) {
    const result = await this.transaksiService.detail(Number(id));
    return result;
  }
}
