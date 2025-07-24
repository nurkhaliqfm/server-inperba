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
import { EbookService } from './ebook.service';
import { Ebook, Repository } from 'src/model/repository.model';
import { v4 as uuid } from 'uuid';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('/api/admin/repository')
export class EbookController {
  constructor(private ebookService: EbookService) {}

  @Post('/ebook/create-many')
  async createManyEbook(@Body() request: Repository) {
    const result = await this.ebookService.createMany(request);
    return result;
  }

  @Post('/ebook/create')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'sampul', maxCount: 1 },
        { name: 'repos', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/ebook/',
          filename: (req, file, cb) => {
            const randomName = uuid().replaceAll('-', '');
            cb(null, randomName + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async createEbook(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() request: Repository,
  ) {
    const { data, ...repos } = request;
    const result = await this.ebookService.create(files, repos, data as Ebook);
    return result;
  }

  @Patch('/ebook')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'sampul', maxCount: 1 },
        { name: 'repos', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './uploads/ebook/',
          filename: (req, file, cb) => {
            const randomName = uuid().replaceAll('-', '');
            cb(null, randomName + extname(file.originalname));
          },
        }),
      },
    ),
  )
  async updateEbook(
    @Query('repos') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() request: Repository,
  ) {
    const { data, ...repos } = request;
    const result = await this.ebookService.update(
      Number(id),
      files,
      repos,
      data as Ebook,
    );
    return result;
  }

  @Get('/ebook/delete')
  async deleteEbook(@Query('repos') id: string) {
    const result = await this.ebookService.delete(Number(id));
    return result;
  }

  @Get('/ebook/detail')
  async detailEbook(@Query('repos') id: string) {
    const result = await this.ebookService.detail(Number(id));
    return result;
  }

  @Get('/ebooks')
  async getEbookPagination(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const result = await this.ebookService.pagination({
      keyword: keyword,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    return result;
  }
}
