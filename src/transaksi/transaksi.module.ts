import { Module } from '@nestjs/common';
import { TransaksiService } from './transaksi.service';
import { TransaksiController } from './transaksi.controller';

@Module({
  providers: [TransaksiService],
  controllers: [TransaksiController],
})
export class TransaksiModule {}
