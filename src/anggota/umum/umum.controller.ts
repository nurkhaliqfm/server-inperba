import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { UmumService } from './umum.service';
import { Umum, User } from 'src/model/anggota.model';

@Controller('/api/admin/anggota')
export class UmumController {
  constructor(private umumService: UmumService) {}

  @Get('/umums')
  async getUmumPagination(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const result = await this.umumService.pagination({
      keyword: keyword,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    return result;
  }

  @Get('/umum/detail')
  async getUmumDetail(@Query('anggota') id_user: string) {
    const result = await this.umumService.detail(Number(id_user));
    return result;
  }

  @Get('/umum/transaksi')
  async getMahasiswaDetailTransaksi(@Query('anggota') id_user: string) {
    const result = await this.umumService.transaksi(Number(id_user));
    return result;
  }

  @Post('/umum/create')
  async createUmum(@Body() request: User) {
    const { data, ...user } = request;

    const result = await this.umumService.create(user, data as Umum);
    return result;
  }

  @Post('/umum/create-many')
  async createManyUmum(@Body() request: Umum) {
    const result = await this.umumService.createMany(request);
    return result;
  }

  @Patch('/umum')
  async updateUmum(@Query('anggota') id_user: string, @Body() request: User) {
    const { data, ...user } = request;

    const result = await this.umumService.update(
      Number(id_user),
      user,
      data as Umum,
    );
    return result;
  }

  @Get('/umum/delete')
  async deleteUmum(@Query('anggota') id_user: string) {
    const result = await this.umumService.delete(Number(id_user));
    return result;
  }

  @Get('/list-umum')
  async getAllUmums() {
    const result = await this.umumService.umums();
    return result;
  }
}
