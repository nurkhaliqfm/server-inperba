import {
  Controller,
  Get,
  Headers,
  Ip,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { BukuService } from 'src/repository/buku/buku.service';
import { EbookService } from 'src/repository/ebook/ebook.service';
import { EjurnalService } from 'src/repository/ejurnal/ejurnal.service';
import { JurnalService } from 'src/repository/jurnal/jurnal.service';
import { SkripsiService } from 'src/repository/skripsi/skripsi.service';
import { PublicService } from './public.service';
import { Request, Response } from 'express';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Controller('/api/public')
export class PublicController {
  constructor(
    private publicService: PublicService,
    private bukuService: BukuService,
    private ebookService: EbookService,
    private ejurnalService: EjurnalService,
    private jurnalService: JurnalService,
    private skripsiService: SkripsiService,
  ) {}
  // NOTE: SKRIPSI
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
  @Get('/skripsi/sampul/:filename')
  getSkripsiSampul(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'skripsi',
      filename,
    );
    const defaultFilePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'default-sampul.jpg',
    );
    const finalPath = existsSync(filePath) ? filePath : defaultFilePath;
    const fileStream = createReadStream(finalPath);

    fileStream.pipe(res);
  }
  @Get('/skripsi/file/:filename')
  getSkripsiFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'skripsi',
      filename,
    );
    const defaultFilePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'default-repos.pdf',
    );
    const finalPath = existsSync(filePath) ? filePath : defaultFilePath;
    res.setHeader('Content-Type', 'application/pdf');

    const fileStream = createReadStream(finalPath);
    fileStream.on('error', (err) => {
      console.error('File stream error:', err);
      res.status(500).send('Error reading file.');
    });
    fileStream.pipe(res);
  }

  // NOTE: ARTIKEL JURNAL
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
  @Get('/jurnal/sampul/:filename')
  getJurnalSampul(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'uploads', 'jurnal', filename);
    const defaultFilePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'default-sampul.jpg',
    );
    const finalPath = existsSync(filePath) ? filePath : defaultFilePath;
    const fileStream = createReadStream(finalPath);

    fileStream.pipe(res);
  }
  @Get('/jurnal/file/:filename')
  getJurnalFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'uploads', 'jurnal', filename);
    const defaultFilePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'default-sampul.jpg',
    );
    const finalPath = existsSync(filePath) ? filePath : defaultFilePath;
    const fileStream = createReadStream(finalPath);

    fileStream.pipe(res);
  }

  // NOTE: EJRUNAL
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
  @Get('/ejurnal/sampul/:filename')
  getEjurnalSampul(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'ejurnal',
      filename,
    );
    const defaultFilePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'default-sampul.jpg',
    );
    const finalPath = existsSync(filePath) ? filePath : defaultFilePath;
    const fileStream = createReadStream(finalPath);

    fileStream.pipe(res);
  }
  @Get('/ejurnal/file/:filename')
  getEjurnalFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'ejurnal',
      filename,
    );
    const defaultFilePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'default-sampul.jpg',
    );
    const finalPath = existsSync(filePath) ? filePath : defaultFilePath;
    const fileStream = createReadStream(finalPath);

    fileStream.pipe(res);
  }

  // NOTE: EBOOK
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
  @Get('/ebook/sampul/:filename')
  getEbookSampul(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'uploads', 'ebook', filename);
    const defaultFilePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'default-sampul.jpg',
    );
    const finalPath = existsSync(filePath) ? filePath : defaultFilePath;
    const fileStream = createReadStream(finalPath);

    fileStream.pipe(res);
  }
  @Get('/ebook/file/:filename')
  getEbookFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'uploads', 'ebook', filename);
    const defaultFilePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'default-sampul.jpg',
    );
    const finalPath = existsSync(filePath) ? filePath : defaultFilePath;
    const fileStream = createReadStream(finalPath);

    fileStream.pipe(res);
  }

  // NOTE: BUKU
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
  @Get('/buku/sampul/:filename')
  getBukuSampul(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'uploads', 'buku', filename);
    const defaultFilePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'default-sampul.jpg',
    );
    const finalPath = existsSync(filePath) ? filePath : defaultFilePath;
    const fileStream = createReadStream(finalPath);

    fileStream.pipe(res);
  }
  @Get('/buku/file/:filename')
  getBukuFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(__dirname, '..', '..', 'uploads', 'buku', filename);
    const defaultFilePath = join(
      __dirname,
      '..',
      '..',
      'uploads',
      'default-sampul.jpg',
    );
    const finalPath = existsSync(filePath) ? filePath : defaultFilePath;
    const fileStream = createReadStream(finalPath);

    fileStream.pipe(res);
  }

  @Get('/ref-lokasi')
  async getListLokasi() {
    const result = await this.publicService.lokasi();
    return result;
  }

  @Get('/counter')
  async hitCounter(
    @Headers('authorization') authorization: string,
    @Headers('user-agent') useragent: string,
    @Ip() ip: string,
    @Req() req: Request,
  ) {
    const result = await this.publicService.counter(
      authorization,
      ip,
      useragent,
      req.originalUrl,
    );
    return result;
  }

  @Get('/repository/rekomendasi')
  async getRekomendasi(
    @Query('repos') repos: string,
    @Query('limit') limit: string,
  ) {
    const result = await this.publicService.rekomendasi(Number(limit), repos);
    return result;
  }
}
