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
import { Repository, Skripsi } from 'src/model/repository.model';
import { v4 as uuid } from 'uuid';
import { SkripsiService } from './skripsi.service';

@Controller('/api/admin/repository')
export class SkripsiController {
  constructor(private skripsiService: SkripsiService) {}

  @Post('/skripsi/create-many')
  async createManySkripsi(@Body() request: Repository) {
    const result = await this.skripsiService.createMany(request);
    return result;
  }

  @Post('/skripsi/create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'sampul', maxCount: 1 },
        { name: 'repos', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/skripsi/',
          filename: (req, file, cb) => {
            const randomName = uuid().replaceAll('-', '');
            cb(null, randomName + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async createSkripsi(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() request: Repository,
  ) {
    const { data, ...repos } = request;
    const result = await this.skripsiService.create(
      files,
      repos,
      data as Skripsi,
    );
    return result;
  }

  @Patch('/skripsi')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'sampul', maxCount: 1 },
        { name: 'repos', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/skripsi/',
          filename: (req, file, cb) => {
            const randomName = uuid().replaceAll('-', '');
            cb(null, randomName + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async updateSkripsi(
    @Query('repos') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() request: Repository,
  ) {
    const { data, ...repos } = request;
    const result = await this.skripsiService.update(
      Number(id),
      files,
      repos,
      data as Skripsi,
    );
    return result;
  }

  @Get('/skripsi/delete')
  async deleteSkripsi(@Query('repos') id: string) {
    const result = await this.skripsiService.delete(Number(id));
    return result;
  }

  @Get('/skripsi/detail')
  async detailSkripsi(@Query('repos') id: string) {
    const result = await this.skripsiService.detail(Number(id));
    return result;
  }

  @Get('/skripsis')
  async getSkripsiPagination(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const result = await this.skripsiService.pagination({
      keyword: keyword,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    return result;
  }
}
