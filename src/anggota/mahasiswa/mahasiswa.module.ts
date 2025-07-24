import { Module } from '@nestjs/common';
import { MahasiswaController } from './mahasiswa.controller';
import { MahasiswaService } from './mahasiswa.service';

@Module({
  providers: [MahasiswaService],
  controllers: [MahasiswaController],
})
export class MahasiswaModule {}
