import { Controller, Get, HttpCode } from '@nestjs/common';
import { StatistikService } from './statistik.service';
import {
  StatistikSummeryResponse,
  StatistikTransaksiResponse,
} from 'src/model/statistik.model';
import { TransaksiResponse } from 'src/model/transaksi.model';

@Controller('/api/admin/statistik')
export class StatistikController {
  constructor(private statistikService: StatistikService) {}

  @Get('/repository')
  @HttpCode(200)
  async repository(): Promise<StatistikSummeryResponse> {
    const result = await this.statistikService.statistik();
    return result;
  }

  @Get('/transaksi')
  @HttpCode(200)
  async transaksi(): Promise<StatistikTransaksiResponse[]> {
    const result = await this.statistikService.transaksi();
    return result;
  }

  @Get('/transaksi/latest')
  @HttpCode(200)
  async latestTransaksi(): Promise<TransaksiResponse[]> {
    const result = await this.statistikService.latestTransaksi();
    return result;
  }

  @Get('/visitor')
  async getVisitor() {
    const result = await this.statistikService.visitor();
    return result;
  }
}
