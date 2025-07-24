import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { CounterValidation } from './public.validation';

@Injectable()
export class PublicService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async lokasi() {
    const data = await this.prismaService.refLokasi.findMany({
      select: {
        id: true,
        nama: true,
      },
    });

    return data;
  }

  async rekomendasi(limit: number, repos: string) {
    const total = await this.prismaService.repository.count({
      where: repos
        ? {
            type: repos as 'BUKU' | 'EBOOK' | 'JURNAL' | 'EJURNAL' | 'SKRIPSI',
          }
        : undefined,
    });

    const countToFetch = limit || 8;
    const randomRepos: Set<any> = new Set();

    while (randomRepos.size < Math.min(countToFetch, total)) {
      const randomIndex = Math.floor(Math.random() * total);

      const repo = await this.prismaService.repository.findFirst({
        skip: randomIndex,
        where: repos
          ? {
              type: repos as
                | 'BUKU'
                | 'EBOOK'
                | 'JURNAL'
                | 'EJURNAL'
                | 'SKRIPSI',
            }
          : undefined,
        select: {
          id: true,
          nama_sampul: true,
          judul: true,
          pengarang: true,
          type: true,
          jurnal: {
            select: {
              abstrak: true,
              penerbit: true,
              tahun_terbit: true,
              jurnal: true,
            },
          },
          ejurnal: {
            select: {
              abstrak: true,
              penerbit: true,
              tahun_terbit: true,
              jurnal: true,
            },
          },
          buku: {
            select: {
              sinopsis: true,
              penerbit: true,
              tahun_terbit: true,
              tempat_terbit: true,
            },
          },
          ebook: {
            select: {
              sinopsis: true,
              penerbit: true,
              tahun_terbit: true,
              tempat_terbit: true,
            },
          },
          skripsi: {
            select: {
              abstrak: true,
              tahun_terbit: true,
              prodi: true,
            },
          },
        },
      });

      if (repo) randomRepos.add(JSON.stringify(repo));
    }

    const repository = Array.from(randomRepos).map((value) =>
      JSON.parse(value),
    );

    return {
      repository: repository,
    };
  }

  async counter(
    authorization: string,
    ip: string,
    useragent: string,
    url: string,
  ) {
    console.log('url : ', url);
    const validation = this.validationService.validate(
      CounterValidation.VISITOR,
      {
        key: authorization,
        user_agent: useragent,
        ip_address: ip,
        url: url,
      },
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const existingVisitor = await this.prismaService.visitor.findFirst({
      where: {
        ip_address: validation.ip_address,
        user_agent: validation.user_agent,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    if (!existingVisitor) {
      await this.prismaService.visitor.create({
        data: {
          date: new Date(),
          ip_address: validation.ip_address,
          user_agent: validation.user_agent,
          url: url,
        },
      });
    }

    return 'Success Record Counter';
  }
}
