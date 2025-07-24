import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { JurnalService } from './jurnal.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { Jurnal, Repository } from 'src/model/repository.model';

@Controller('/api/admin/repository')
export class JurnalController {
  constructor(private jurnalService: JurnalService) {}

  @Post('/jurnal/create-many')
  async createManyJurnal(@Body() request: Repository) {
    const result = await this.jurnalService.createMany(request);
    return result;
  }

  @Post('/jurnal/create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'sampul', maxCount: 1 },
        { name: 'repos', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/jurnal/',
          filename: (req, file, cb) => {
            const randomName = uuid().replaceAll('-', '');
            cb(null, randomName + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async createJurnal(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() request: Repository,
  ) {
    const { data, ...repos } = request;
    const result = await this.jurnalService.create(
      files,
      repos,
      data as Jurnal,
    );
    return result;
  }

  @Patch('/jurnal')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'sampul', maxCount: 1 },
        { name: 'repos', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/jurnal/',
          filename: (req, file, cb) => {
            const randomName = uuid().replaceAll('-', '');
            cb(null, randomName + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async updateJurnal(
    @Query('repos') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() request: Repository,
  ) {
    const { data, ...repos } = request;
    const result = await this.jurnalService.update(
      Number(id),
      files,
      repos,
      data as Jurnal,
    );
    return result;
  }

  @Get('/jurnal/delete')
  async deleteJurnal(@Query('repos') id: string) {
    const result = await this.jurnalService.delete(Number(id));
    return result;
  }

  @Get('/jurnal/detail')
  async detailJurnal(@Query('repos') id: string) {
    const result = await this.jurnalService.detail(Number(id));
    return result;
  }

  @Get('/jurnals')
  async getJurnalPagination(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const result = await this.jurnalService.pagination({
      keyword: keyword,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    return result;
  }
}
