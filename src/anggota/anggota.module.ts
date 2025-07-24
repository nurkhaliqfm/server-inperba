import { Module } from '@nestjs/common';
import { MahasiswaModule } from './mahasiswa/mahasiswa.module';
import { DosenModule } from './dosen/dosen.module';
import { UmumModule } from './umum/umum.module';

@Module({
  imports: [MahasiswaModule, DosenModule, UmumModule],
})
export class AnggotaModule {}
