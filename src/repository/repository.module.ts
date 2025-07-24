import { Module } from '@nestjs/common';
import { EjurnalModule } from './ejurnal/ejurnal.module';
import { JurnalModule } from './jurnal/jurnal.module';
import { EbookModule } from './ebook/ebook.module';
import { BukuModule } from './buku/buku.module';
import { SkripsiModule } from './skripsi/skripsi.module';

@Module({
  imports: [
    EjurnalModule,
    JurnalModule,
    EbookModule,
    BukuModule,
    SkripsiModule,
  ],
})
export class RepositoryModule {}
