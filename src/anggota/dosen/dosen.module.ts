import { Module } from '@nestjs/common';
import { DosenService } from './dosen.service';
import { DosenController } from './dosen.controller';

@Module({
  providers: [DosenService],
  controllers: [DosenController],
})
export class DosenModule {}
