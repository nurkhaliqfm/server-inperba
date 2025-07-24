import { Module } from '@nestjs/common';
import { EbookService } from './ebook.service';
import { EbookController } from './ebook.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/ebook',
    }),
  ],
  providers: [EbookService],
  controllers: [EbookController],
})
export class EbookModule {}
