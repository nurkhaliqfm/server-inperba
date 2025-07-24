import { Module } from '@nestjs/common';
import { UmumService } from './umum.service';
import { UmumController } from './umum.controller';

@Module({
  providers: [UmumService],
  controllers: [UmumController],
})
export class UmumModule {}
