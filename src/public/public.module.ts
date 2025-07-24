import { Module } from '@nestjs/common';
import { PublicService } from './public.service';
import { PublicController } from './public.controller';
import { BukuController } from 'src/repository/buku/buku.controller';
import { BukuService } from 'src/repository/buku/buku.service';
import { SkripsiService } from 'src/repository/skripsi/skripsi.service';
import { JurnalService } from 'src/repository/jurnal/jurnal.service';
import { EbookService } from 'src/repository/ebook/ebook.service';
import { EjurnalService } from 'src/repository/ejurnal/ejurnal.service';
import { EbookController } from 'src/repository/ebook/ebook.controller';
import { JurnalController } from 'src/repository/jurnal/jurnal.controller';
import { EjurnalController } from 'src/repository/ejurnal/ejurnal.controller';
import { SkripsiController } from 'src/repository/skripsi/skripsi.controller';

@Module({
  providers: [
    PublicService,
    BukuService,
    EbookService,
    JurnalService,
    EjurnalService,
    SkripsiService,
  ],
  controllers: [
    PublicController,
    BukuController,
    EbookController,
    JurnalController,
    EjurnalController,
    SkripsiController,
  ],
})
export class PublicModule {}
