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
import { BukuService } from './buku.service';
import { Buku, Repository } from 'src/model/repository.model';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

@Controller('/api/admin/repository')
export class BukuController {
  constructor(private bukuService: BukuService) {}

  @Post('/buku/create-many')
  async createManyBuku(@Body() request: Repository) {
    const result = await this.bukuService.createMany(request);
    return result;
  }

  @Post('/buku/create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'sampul', maxCount: 1 },
        { name: 'repos', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/buku/',
          filename: (req, file, cb) => {
            const randomName = uuid().replaceAll('-', '');
            cb(null, randomName + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async createBuku(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() request: Repository,
  ) {
    const { data, ...repos } = request;
    const result = await this.bukuService.create(files, repos, data as Buku);
    return result;
  }

  @Patch('/buku')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'sampul', maxCount: 1 },
        { name: 'repos', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/buku/',
          filename: (req, file, cb) => {
            const randomName = uuid().replaceAll('-', '');
            cb(null, randomName + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async updateBuku(
    @Query('repos') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() request: Repository,
  ) {
    const { data, ...repos } = request;
    const result = await this.bukuService.update(
      Number(id),
      files,
      repos,
      data as Buku,
    );
    return result;
  }

  @Get('/buku/delete')
  async deleteBuku(@Query('repos') id: string) {
    const result = await this.bukuService.delete(Number(id));
    return result;
  }

  @Get('/buku/detail')
  async detailBuku(@Query('repos') id: string) {
    const result = await this.bukuService.detail(Number(id));
    return result;
  }

  @Get('/bukus')
  async getBukuPagination(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const result = await this.bukuService.pagination({
      keyword: keyword,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    return result;
  }
}
