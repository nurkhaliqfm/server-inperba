import { Module } from '@nestjs/common';
import { BukuService } from './buku.service';
import { BukuController } from './buku.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/buku',
    }),
  ],
  providers: [BukuService],
  controllers: [BukuController],
})
export class BukuModule {}
