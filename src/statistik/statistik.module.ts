import { Module } from '@nestjs/common';
import { StatistikService } from './statistik.service';
import { StatistikController } from './statistik.controller';

@Module({
  providers: [StatistikService],
  controllers: [StatistikController],
})
export class StatistikModule {}
