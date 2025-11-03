import { Body, Controller, Get, Patch, Post, Query, Req } from '@nestjs/common';
import { AdminService } from './admin.service';
import { PerkaraRequest } from 'src/model/perkara.model';
import { UpdatePasswordRequest } from 'src/model/user.model';

@Controller('/api/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('/perkaras')
  async getPerkaraPagination(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const result = await this.adminService.pagination({
      keyword: keyword,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    return result;
  }

  @Post('/perkara/create')
  async createPerkara(@Body() request: { data: PerkaraRequest }) {
    const { data } = request;
    const result = await this.adminService.create(data);
    return result;
  }

  @Get('/perkara-detail')
  async detailPerkara(@Query('perkara') id_perkara: string) {
    const result = await this.adminService.detail(Number(id_perkara));
    return result;
  }

  @Get('/perkara/delete')
  async deletePerkara(@Query('perkara') id_perkara: string) {
    const result = await this.adminService.delete(Number(id_perkara));
    return result;
  }

  @Patch('/perkara/update')
  async updatePerkara(
    @Query('perkara') id_perkara: string,
    @Body() request: { data: PerkaraRequest },
  ) {
    const { data } = request;
    const result = await this.adminService.update(Number(id_perkara), data);
    return result;
  }

  @Patch('/reset-password')
  async updatePassword(
    @Req() req: any,
    @Body() body: { data: UpdatePasswordRequest },
  ) {
    const { id_user } = req;
    const { data } = body;
    const result = await this.adminService.password(Number(id_user), data);
    return result;
  }
}
