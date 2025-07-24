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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Ejurnal, Repository } from 'src/model/repository.model';
import { v4 as uuid } from 'uuid';
import { EjurnalService } from './ejurnal.service';

@Controller('/api/admin/repository')
export class EjurnalController {
  constructor(private ejurnalService: EjurnalService) {}

  @Post('/ejurnal/create-many')
  async createManyEjurnal(@Body() request: Repository) {
    const result = await this.ejurnalService.createMany(request);
    return result;
  }

  @Post('/ejurnal/create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'sampul', maxCount: 1 },
        { name: 'repos', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/ejurnal/',
          filename: (req, file, cb) => {
            const randomName = uuid().replaceAll('-', '');
            cb(null, randomName + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async createEjurnal(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() request: Repository,
  ) {
    const { data, ...repos } = request;
    const result = await this.ejurnalService.create(
      files,
      repos,
      data as Ejurnal,
    );
    return result;
  }

  @Patch('/ejurnal')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'sampul', maxCount: 1 },
        { name: 'repos', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/ejurnal/',
          filename: (req, file, cb) => {
            const randomName = uuid().replaceAll('-', '');
            cb(null, randomName + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async updateEjurnal(
    @Query('repos') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() request: Repository,
  ) {
    const { data, ...repos } = request;
    const result = await this.ejurnalService.update(
      Number(id),
      files,
      repos,
      data as Ejurnal,
    );
    return result;
  }

  @Get('/ejurnal/delete')
  async deleteEjurnal(@Query('repos') id: string) {
    const result = await this.ejurnalService.delete(Number(id));
    return result;
  }

  @Get('/ejurnal/detail')
  async detailEjurnal(@Query('repos') id: string) {
    const result = await this.ejurnalService.detail(Number(id));
    return result;
  }

  @Get('/ejurnals')
  async getEjurnalPagination(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const result = await this.ejurnalService.pagination({
      keyword: keyword,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    return result;
  }
}
