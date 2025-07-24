import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { BaseRepository, Jurnal } from 'src/model/repository.model';
import { PaginationRequest } from 'src/model/web.model';
import { HandleFileAction, HandleFileDeletation } from 'src/utils/files.utils';

@Injectable()
export class JurnalService {
  constructor(private prismaService: PrismaService) {}

  async createMany(repos: BaseRepository) {
    Object.values(repos).forEach(async (element) => {
      await this.prismaService.repository.create({
        data: {
          judul: element.judul,
          pengarang: element.pengarang,
          type: 'JURNAL',
          nama_sampul: element.nama_sampul,
          jurnal: {
            create: {
              abstrak: element.abstrak,
              penerbit: element.penerbit,
              jurnal: element.jurnal,
              isbn: element.isbn,
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

    return 'Success create many new artikel jurnal repository';
  }

  async create(
    files: Express.Multer.File[],
    repos: BaseRepository,
    request: Jurnal,
  ) {
    const filesReposCreate: Record<string, string | null> = {};

    filesReposCreate.nama_sampul = await HandleFileAction(
      null,
      files['sampul'],
      null,
      'jurnal',
    );

    await this.prismaService.repository.create({
      data: {
        judul: repos.judul,
        type: repos.type,
        pengarang: repos.pengarang,
        ...filesReposCreate,
        jurnal: {
          create: {
            ...request,
            id_lokasi: Number(request.id_lokasi),
            tahun_terbit: Number(request.tahun_terbit),
          },
        },
      },
    });

    return 'Success create new artikel jurnal repository';
  }

  async update(
    id_repos: number,
    files: Express.Multer.File[],
    repos: BaseRepository,
    request: Jurnal,
  ) {
    const filesReposUpdate: Record<string, string | null> = {};

    const data = await this.prismaService.repository.findFirst({
      where: { id: id_repos },
      select: {
        id: true,
        nama_file: true,
        nama_sampul: true,
        jurnal: {
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
        'jurnal',
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
          jurnal: {
            update: {
              ...request,
              id_lokasi: Number(request.id_lokasi),
              tahun_terbit: Number(request.tahun_terbit),
            },
          },
        },
      });
    }

    return 'Success update artikel jurnal repository';
  }

  async delete(id_repos: number) {
    const data = await this.prismaService.repository.findFirst({
      where: { id: id_repos },
      select: {
        id: true,
        nama_file: true,
        nama_sampul: true,
        jurnal: {
          select: {
            id: true,
          },
        },
      },
    });

    if (data.id) {
      await HandleFileDeletation(data.nama_sampul, 'jurnal');

      await this.prismaService.repository.delete({
        where: { id: data.id, jurnal: { id: data.jurnal.id } },
      });
    }

    return 'Success delete artikel jurnal repository';
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
        jurnal: {
          select: {
            id: true,
            abstrak: true,
            lokasi: {
              select: {
                id: true,
                nama: true,
              },
            },
            tahun_terbit: true,
            isbn: true,
            jurnal: true,
            penerbit: true,
          },
        },
      },
    });

    if (data) {
      return data;
    }

    throw new HttpException('Repository artikel jurnal not found', 400);
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
        type: 'JURNAL',
        OR: request.keyword && rule,
      },
    });

    const jurnals = await this.prismaService.repository.findMany({
      where: {
        type: 'JURNAL',
        OR: request.keyword && rule,
      },
      select: {
        id: true,
        judul: true,
        pengarang: true,
        nama_file: true,
        nama_sampul: true,
        type: true,
        jurnal: {
          select: {
            id: true,
            abstrak: true,
            lokasi: {
              select: {
                id: true,
                nama: true,
              },
            },
            tahun_terbit: true,
            isbn: true,
            jurnal: true,
            penerbit: true,
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
      repository: jurnals,
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
