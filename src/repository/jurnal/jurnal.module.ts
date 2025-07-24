import { Module } from '@nestjs/common';
import { JurnalService } from './jurnal.service';
import { JurnalController } from './jurnal.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/jurnal',
    }),
  ],
  providers: [JurnalService],
  controllers: [JurnalController],
})
export class JurnalModule {}
