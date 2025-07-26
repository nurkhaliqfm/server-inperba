import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class PublicService {
  constructor(private prismaService: PrismaService) {}

  async perkara() {
    const data = await this.prismaService.perkaraBanding.findMany({
      select: {
        id: true,
        kontak_wa: true,
        tanggal_registrasi: true,
        nomor_perkara: true,
        status_penetapan_majelis: true,
        tanggal_penetapan_majelis: true,
        status_penunjukan_panitera: true,
        tanggal_penunjukan_panitera: true,
        status_penetapan_sidang: true,
        tanggal_penetapan_sidang: true,
        status_hari_sidang: true,
        tanggal_hari_sidang: true,
        status_proses: true,
      },
    });

    return data;
  }
}
