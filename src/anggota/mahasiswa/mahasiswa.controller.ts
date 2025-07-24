import { Body, Controller, Get, Patch, Post, Query, Res } from '@nestjs/common';
import { Mahasiswa, User } from 'src/model/anggota.model';
import { MahasiswaService } from './mahasiswa.service';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as mustache from 'mustache';
import { Response } from 'express';
import { join } from 'path';
import * as dayjs from 'dayjs';

@Controller('/api/admin/anggota')
export class MahasiswaController {
  constructor(private mahasiswaService: MahasiswaService) {}

  @Get('/mahasiswas')
  async getMahasiswaPagination(
    @Query('keyword') keyword: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const result = await this.mahasiswaService.pagination({
      keyword: keyword,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    return result;
  }

  @Get('/mahasiswa/detail')
  async getMahasiswaDetail(@Query('anggota') id_user: string) {
    const result = await this.mahasiswaService.detail(Number(id_user));
    return result;
  }

  @Get('/mahasiswa/transaksi')
  async getMahasiswaDetailTransaksi(@Query('anggota') id_user: string) {
    const result = await this.mahasiswaService.transaksi(Number(id_user));
    return result;
  }

  @Post('/mahasiswa/create')
  async createMahasiswa(@Body() request: User) {
    const { data, ...user } = request;

    const result = await this.mahasiswaService.create(user, data as Mahasiswa);
    return result;
  }

  @Post('/mahasiswa/create-many')
  async createManyMahasiswa(@Body() request: Mahasiswa) {
    const result = await this.mahasiswaService.createMany(request);
    return result;
  }

  @Patch('/mahasiswa')
  async updateMahasiswa(
    @Query('anggota') id_user: string,
    @Body() request: User,
  ) {
    const { data, ...user } = request;

    const result = await this.mahasiswaService.update(
      Number(id_user),
      user,
      data as Mahasiswa,
    );
    return result;
  }

  @Get('/mahasiswa/delete')
  async deleteMahasiswa(@Query('anggota') id_user: string) {
    const result = await this.mahasiswaService.delete(Number(id_user));
    return result;
  }

  @Get('/list-mahasiswa')
  async getAllMahasiswas() {
    const result = await this.mahasiswaService.mahasiswas();
    return result;
  }

  @Get('/mahasiswa/bebas-pustaka')
  async createBebasPustakaDoc(
    @Query('anggota') id_user: string,
    @Res() res: Response,
  ) {
    const result = await this.mahasiswaService.document(Number(id_user));

    const filePath = join(
      __dirname,
      '..',
      '..',
      '..',
      'src',
      'assets',
      'bebas-pustaka.html',
    );
    const templateBebasPustaka = fs.readFileSync(filePath, 'utf8');
    const htmlScript = mustache.render(templateBebasPustaka, {
      nama: result.mahasiswa.nama,
      nim: result.mahasiswa.nim,
      fakultas: result.mahasiswa.fakultas,
      prodi: result.mahasiswa.prodi.nama,
      today: dayjs(new Date()).format('DD MMMM YYYY'),
    });

    const browser = await puppeteer.launch({
      ...(process.env.PUPPETEER_CACHE_DIR && {
        executablePath: process.env.PUPPETEER_CACHE_DIR,
      }),
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();

      await page.setContent(htmlScript, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'inline; filename="bebas-pustaka.pdf"',
      );
      res.send(Buffer.from(pdfBuffer));
    } finally {
      await browser.close();
    }
  }
}
