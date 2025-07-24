import { Module } from '@nestjs/common';
import { EjurnalService } from './ejurnal.service';
import { EjurnalController } from './ejurnal.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/ejurnal',
    }),
  ],
  providers: [EjurnalService],
  controllers: [EjurnalController],
})
export class EjurnalModule {}
