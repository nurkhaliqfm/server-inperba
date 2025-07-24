import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { DosenService } from './dosen.service';
import { Dosen, User } from 'src/model/anggota.model';

@Controller('/api/admin/anggota')
export class DosenController {
  constructor(private dosenService: DosenService) {}

  @Get('/dosens')
  async getDosenPagination(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const result = await this.dosenService.pagination({
      keyword: keyword,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    return result;
  }

  @Get('/dosen/detail')
  async getDosenDetail(@Query('anggota') id_user: string) {
    const result = await this.dosenService.detail(Number(id_user));
    return result;
  }

  @Get('/dosen/transaksi')
  async getMahasiswaDetailTransaksi(@Query('anggota') id_user: string) {
    const result = await this.dosenService.transaksi(Number(id_user));
    return result;
  }

  @Post('/dosen/create')
  async createDosen(@Body() request: User) {
    const { data, ...user } = request;

    const result = await this.dosenService.create(user, data as Dosen);
    return result;
  }

  @Post('/dosen/create-many')
  async createManyDosen(@Body() request: Dosen) {
    const result = await this.dosenService.createMany(request);
    return result;
  }

  @Patch('/dosen')
  async updateDosen(@Query('anggota') id_user: string, @Body() request: User) {
    const { data, ...user } = request;

    const result = await this.dosenService.update(
      Number(id_user),
      user,
      data as Dosen,
    );
    return result;
  }

  @Get('/dosen/delete')
  async deleteDosen(@Query('anggota') id_user: string) {
    const result = await this.dosenService.delete(Number(id_user));
    return result;
  }

  @Get('/list-dosen')
  async getAllDosens() {
    const result = await this.dosenService.dosens();
    return result;
  }
}
