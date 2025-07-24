import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { BaseRepository, Ejurnal } from 'src/model/repository.model';
import { PaginationRequest } from 'src/model/web.model';
import { HandleFileAction, HandleFileDeletation } from 'src/utils/files.utils';

@Injectable()
export class EjurnalService {
  constructor(private prismaService: PrismaService) {}

  async createMany(repos: BaseRepository) {
    Object.values(repos).forEach(async (element) => {
      await this.prismaService.repository.create({
        data: {
          judul: element.judul,
          pengarang: element.pengarang,
          type: 'EJURNAL',
          nama_file: element.nama_file,
          nama_sampul: element.nama_sampul,
          ejurnal: {
            create: {
              abstrak: element.abstrak,
              penerbit: element.penerbit,
              jurnal: element.jurnal,
              tahun_terbit: Number(element.tahun_terbit),
              isbn: element.isbn,
            },
          },
        },
      });
    });

    return 'Success create many new e-jurnal repository';
  }

  async create(
    files: Express.Multer.File[],
    repos: BaseRepository,
    request: Ejurnal,
  ) {
    const filesReposCreate: Record<string, string | null> = {};

    filesReposCreate.nama_sampul = await HandleFileAction(
      null,
      files['sampul'],
      null,
      'ejurnal',
    );

    filesReposCreate.nama_file = await HandleFileAction(
      null,
      files['repos'],
      null,
      'ejurnal',
    );

    await this.prismaService.repository.create({
      data: {
        judul: repos.judul,
        type: repos.type,
        pengarang: repos.pengarang,
        ...filesReposCreate,
        ejurnal: {
          create: {
            ...request,
            tahun_terbit: Number(request.tahun_terbit),
          },
        },
      },
    });

    return 'Success create new e-jurnal repository';
  }

  async update(
    id_repos: number,
    files: Express.Multer.File[],
    repos: BaseRepository,
    request: Ejurnal,
  ) {
    const filesReposUpdate: Record<string, string | null> = {};

    const data = await this.prismaService.repository.findFirst({
      where: { id: id_repos },
      select: {
        id: true,
        nama_file: true,
        nama_sampul: true,
        ejurnal: {
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
        'ejurnal',
      );

      filesReposUpdate.nama_file = await HandleFileAction(
        repos.nama_file,
        files['repos'],
        data.nama_file,
        'ejurnal',
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
          ejurnal: {
            update: {
              ...request,
              tahun_terbit: Number(request.tahun_terbit),
            },
          },
        },
      });
    }

    return 'Success update e-jurnal repository';
  }

  async delete(id_repos: number) {
    const data = await this.prismaService.repository.findFirst({
      where: { id: id_repos },
      select: {
        id: true,
        nama_file: true,
        nama_sampul: true,
        ejurnal: {
          select: {
            id: true,
          },
        },
      },
    });

    if (data.id) {
      await HandleFileDeletation(data.nama_sampul, 'ejurnal');
      await HandleFileDeletation(data.nama_file, 'ejurnal');

      await this.prismaService.repository.delete({
        where: { id: data.id, ejurnal: { id: data.ejurnal.id } },
      });
    }

    return 'Success delete ejurnal repository';
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
        ejurnal: {
          select: {
            id: true,
            abstrak: true,
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

    throw new HttpException('Repository e-jurnal not found', 400);
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
        type: 'EJURNAL',
        OR: request.keyword && rule,
      },
    });

    const ejurnals = await this.prismaService.repository.findMany({
      where: {
        type: 'EJURNAL',
        OR: request.keyword && rule,
      },
      select: {
        id: true,
        judul: true,
        pengarang: true,
        nama_file: true,
        nama_sampul: true,
        type: true,
        ejurnal: {
          select: {
            id: true,
            abstrak: true,
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
      repository: ejurnals,
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
