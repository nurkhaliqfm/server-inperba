import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { BaseRepository, Skripsi } from 'src/model/repository.model';
import { PaginationRequest } from 'src/model/web.model';
import { HandleFileAction, HandleFileDeletation } from 'src/utils/files.utils';

@Injectable()
export class SkripsiService {
  constructor(private prismaService: PrismaService) {}

  async createMany(repos: BaseRepository) {
    Object.values(repos).forEach(async (element) => {
      await this.prismaService.repository.create({
        data: {
          judul: element.judul,
          pengarang: element.pengarang,
          type: 'SKRIPSI',
          nama_file: element.nama_file,
          nama_sampul: element.nama_sampul,
          skripsi: {
            create: {
              abstrak: element.abstrak,
              fakultas: element.fakultas,
              id_prodi: 1,
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
              tahun_terbit: Number(element.tahun_terbit),
            },
          },
        },
      });
    });

    return 'Success create many new skripsi repository';
  }

  async create(
    files: Express.Multer.File[],
    repos: BaseRepository,
    request: Skripsi,
  ) {
    const filesReposCreate: Record<string, string | null> = {};

    filesReposCreate.nama_sampul = await HandleFileAction(
      null,
      files['sampul'],
      null,
      'skripsi',
    );

    filesReposCreate.nama_file = await HandleFileAction(
      null,
      files['repos'],
      null,
      'skripsi',
    );

    await this.prismaService.repository.create({
      data: {
        judul: repos.judul,
        type: repos.type,
        pengarang: repos.pengarang,
        ...filesReposCreate,
        skripsi: {
          create: {
            ...request,
            id_prodi: Number(request.id_prodi),
            id_lokasi: Number(request.id_lokasi),
            tahun_terbit: Number(request.tahun_terbit),
          },
        },
      },
    });

    return 'Success create new skripsi repository';
  }

  async update(
    id_repos: number,
    files: Express.Multer.File[],
    repos: BaseRepository,
    request: Skripsi,
  ) {
    const filesReposUpdate: Record<string, string | null> = {};

    const data = await this.prismaService.repository.findFirst({
      where: { id: id_repos },
      select: {
        id: true,
        nama_file: true,
        nama_sampul: true,
        skripsi: {
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
        'skripsi',
      );

      filesReposUpdate.nama_file = await HandleFileAction(
        repos.nama_file,
        files['repos'],
        data.nama_file,
        'skripsi',
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
          skripsi: {
            update: {
              ...request,
              id_lokasi: Number(request.id_lokasi),
              id_prodi: Number(request.id_prodi),
              tahun_terbit: Number(request.tahun_terbit),
            },
          },
        },
      });
    }

    return 'Success update skripsi repository';
  }

  async delete(id_repos: number) {
    const data = await this.prismaService.repository.findFirst({
      where: { id: id_repos },
      select: {
        id: true,
        nama_file: true,
        nama_sampul: true,
        skripsi: {
          select: {
            id: true,
          },
        },
      },
    });

    if (data.id) {
      await HandleFileDeletation(data.nama_sampul, 'skripsi');
      await HandleFileDeletation(data.nama_file, 'skripsi');

      await this.prismaService.repository.delete({
        where: { id: data.id, skripsi: { id: data.skripsi.id } },
      });
    }

    return 'Success delete skripsi repository';
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
        skripsi: {
          select: {
            id: true,
            abstrak: true,
            fakultas: true,
            lokasi: {
              select: {
                id: true,
                nama: true,
              },
            },
            prodi: {
              select: {
                id: true,
                nama: true,
              },
            },
            tahun_terbit: true,
          },
        },
      },
    });

    if (data) {
      return data;
    }

    throw new HttpException('Repository skripsi not found', 400);
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
        type: 'SKRIPSI',
        OR: request.keyword && rule,
      },
    });

    const skripsis = await this.prismaService.repository.findMany({
      where: {
        type: 'SKRIPSI',
        OR: request.keyword && rule,
      },
      select: {
        id: true,
        judul: true,
        pengarang: true,
        nama_file: true,
        nama_sampul: true,
        type: true,
        skripsi: {
          select: {
            id: true,
            abstrak: true,
            fakultas: true,
            lokasi: {
              select: {
                nama: true,
              },
            },
            prodi: {
              select: {
                nama: true,
              },
            },
            tahun_terbit: true,
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
      repository: skripsis,
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
