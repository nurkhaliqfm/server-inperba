import { Module } from '@nestjs/common';
import { SkripsiService } from './skripsi.service';
import { SkripsiController } from './skripsi.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/skripsi',
    }),
  ],
  providers: [SkripsiService],
  controllers: [SkripsiController],
})
export class SkripsiModule {}
