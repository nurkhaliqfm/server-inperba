import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class PublicService {
  constructor(private prismaService: PrismaService) {}

  async detail(identity: string, perkara: string) {
    const getIdentity = await this.prismaService.sessionOTP.findFirst({
      where: {
        identity: identity,
        isValidate: true,
      },
    });

    if (!getIdentity)
      throw new HttpException(`You don't have access to this information`, 400);

    const splitIdentity = atob(identity).split('$_^');

    const data = await this.prismaService.perkaraBanding.findFirst({
      where: {
        nomor_perkara: perkara,
        kontak_wa: splitIdentity[0],
      },
      select: {
        id: true,
        kontak_wa: true,
        pembading: true,
        terbanding: true,
        jenis_perkara: true,
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
        amar_putusan: true,
      },
    });

    if (!data)
      throw new HttpException(`You don't have access to this information`, 400);

    return data;
  }

  async statistik() {
    const perkara = await this.prismaService.perkaraBanding.count();

    const perkaraPutus = await this.prismaService.perkaraBanding.count({
      where: {
        status_proses: 'PUTUS',
      },
    });

    const sisaPerkara = perkara - perkaraPutus;
    const persentase =
      perkara === 0 ? 0 : ((perkaraPutus / perkara) * 100).toFixed(2);

    return {
      perkara: perkara,
      sisa: sisaPerkara,
      putus: perkaraPutus,
      persentase: `${persentase}%`,
    };
  }
}
