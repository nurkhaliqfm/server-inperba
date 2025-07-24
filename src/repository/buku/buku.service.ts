import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { BaseRepository, Buku } from 'src/model/repository.model';
import { PaginationRequest } from 'src/model/web.model';
import { HandleFileAction, HandleFileDeletation } from 'src/utils/files.utils';

@Injectable()
export class BukuService {
  constructor(private prismaService: PrismaService) {}

  async createMany(repos: BaseRepository) {
    Object.values(repos).forEach(async (element) => {
      await this.prismaService.repository.create({
        data: {
          judul: element.judul,
          pengarang: element.pengarang,
          type: 'BUKU',
          nama_sampul: element.nama_sampul,
          buku: {
            create: {
              tanggal:
                element.tanggal !== ''
                  ? new Date(element.tanggal).toISOString()
                  : null,
              no_regist: element.no_regist !== '' ? element.no_regist : null,
              sinopsis: element.sinopsis !== '' ? element.sinopsis : null,
              cetakan: element.cetakan !== '' ? element.cetakan : null,
              penerbit: element.penerbit,
              tempat_terbit:
                element.tempat_terbit !== '' ? element.tempat_terbit : null,
              asal_buku: element.asal_buku !== '' ? element.asal_buku : null,
              isbn: element.isbn,
              no_klasifikasi:
                element.no_klasifikasi !== '' ? element.no_klasifikasi : null,
              harga:
                element.harga !== '' || element.harga !== '-'
                  ? Number(element.harga)
                  : 0,
              jumlah_buku:
                element.jumlah_buku !== '' ? Number(element.jumlah_buku) : 0,
              keterangan: element.keterangan !== '' ? element.keterangan : null,
              tahun_terbit: Number(element.tahun_terbit),
              id_lokasi:
                element.lokasi === 'rak 1'
                  ? 1
                  : element.lokasi === 'rak 2'
                    ? 2
                    : element.lokasi === 'rak 3'
                      ? 3
                      : element.lokasi === 'rak 4'
                        ? 4
                        : null,
            },
          },
        },
      });
    });

    return 'Success create many new buku repository';
  }

  async create(
    files: Express.Multer.File[],
    repos: BaseRepository,
    request: Buku,
  ) {
    const filesReposCreate: Record<string, string | null> = {};

    filesReposCreate.nama_sampul = await HandleFileAction(
      null,
      files['sampul'],
      null,
      'buku',
    );

    await this.prismaService.repository.create({
      data: {
        judul: repos.judul,
        type: repos.type,
        pengarang: repos.pengarang,
        ...filesReposCreate,
        buku: {
          create: {
            ...request,
            harga: Number(request.harga),
            jumlah_buku: Number(request.jumlah_buku),
            tanggal: request.tanggal === '' ? null : request.tanggal,
            tahun_terbit: Number(request.tahun_terbit),
            id_lokasi: Number(request.id_lokasi),
          },
        },
      },
    });

    return 'Success create new buku repository';
  }

  async update(
    id_repos: number,
    files: Express.Multer.File[],
    repos: BaseRepository,
    request: Buku,
  ) {
    const filesReposUpdate: Record<string, string | null> = {};

    const data = await this.prismaService.repository.findFirst({
      where: { id: id_repos },
      select: {
        id: true,
        nama_file: true,
        nama_sampul: true,
        buku: {
          select: {
            id: true,
          },
        },
      },
    });

    if (data.id) {
      filesReposUpdate.nama_sampul = await HandleFileAction(
        repos.nama_sampul,
        files['sampul'],
        data.nama_sampul,
        'buku',
      );

      await this.prismaService.repository.update({
        where: {
          id: data.id,
        },
        data: {
          judul: repos.judul,
          type: repos.type,
          pengarang: repos.pengarang,
          ...filesReposUpdate,
          buku: {
            update: {
              ...request,
              harga: Number(request.harga),
              jumlah_buku: Number(request.jumlah_buku),
              tanggal: request.tanggal === '' ? null : request.tanggal,
              tahun_terbit: Number(request.tahun_terbit),
              id_lokasi: Number(request.id_lokasi),
            },
          },
        },
      });
    }

    return 'Success update buku repository';
  }

  async delete(id_repos: number) {
    const data = await this.prismaService.repository.findFirst({
      where: { id: id_repos },
      select: {
        id: true,
        nama_file: true,
        nama_sampul: true,
        buku: {
          select: {
            id: true,
          },
        },
      },
    });

    if (data.id) {
      await HandleFileDeletation(data.nama_sampul, 'buku');

      await this.prismaService.repository.delete({
        where: { id: data.id, buku: { id: data.buku.id } },
      });
    }

    return 'Success delete buku repository';
  }

  async detail(id_repos: number) {
    const data = await this.prismaService.repository.findFirst({
      where: { id: id_repos },
      select: {
        judul: true,
        pengarang: true,
        nama_file: true,
        nama_sampul: true,
        type: true,
        buku: {
          select: {
            id: true,
            tahun_terbit: true,
            isbn: true,
            penerbit: true,
            cetakan: true,
            sinopsis: true,
            tempat_terbit: true,
            asal_buku: true,
            harga: true,
            jumlah_buku: true,
            keterangan: true,
            lokasi: {
              select: {
                id: true,
                nama: true,
              },
            },
            no_klasifikasi: true,
            no_regist: true,
            tanggal: true,
          },
        },
      },
    });

    if (data) {
      return data;
    }

    throw new HttpException('Repository buku not found', 400);
  }

  async pagination(request: PaginationRequest) {
    const rule = [
      {
        judul: request.keyword
          ? {
              contains: request.keyword,
            }
          : undefined,
      },
      {
        pengarang: request.keyword
          ? {
              contains: request.keyword,
            }
          : undefined,
      },
    ];

    const totalCount = await this.prismaService.repository.count({
      where: {
        type: 'BUKU',
        OR: request.keyword && rule,
      },
    });

    const bukus = await this.prismaService.repository.findMany({
      where: {
        type: 'BUKU',
        OR: request.keyword && rule,
      },
      select: {
        id: true,
        judul: true,
        pengarang: true,
        nama_file: true,
        nama_sampul: true,
        type: true,
        buku: {
          select: {
            id: true,
            tahun_terbit: true,
            isbn: true,
            penerbit: true,
            cetakan: true,
            sinopsis: true,
            tempat_terbit: true,
            asal_buku: true,
            harga: true,
            jumlah_buku: true,
            keterangan: true,
            lokasi: {
              select: {
                id: true,
                nama: true,
              },
            },
            no_klasifikasi: true,
            no_regist: true,
            tanggal: true,
          },
        },
      },
      skip: (request.page - 1) * request.limit,
      take: request.limit,
    });

    const totalPages = Math.ceil(totalCount / request.limit);
    let endPage = totalPages;
    let startPage = 1;

    if (request.page < totalPages - 4) {
      endPage = request.page + 3;
    }

    if (request.page > 2) {
      startPage = request.page - 2;
      endPage = request.page + 2;
    }

    if (request.page > totalPages - 3) {
      endPage = totalPages;
    }

    return {
      repository: bukus,
      total: totalCount,
      pages: {
        total: totalPages,
        start: startPage,
        end: endPage,
        current: request.page,
      },
    };
  }
}
