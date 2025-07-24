import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { BaseRepository, Ebook } from 'src/model/repository.model';
import { PaginationRequest } from 'src/model/web.model';
import { HandleFileAction, HandleFileDeletation } from 'src/utils/files.utils';

@Injectable()
export class EbookService {
  constructor(private prismaService: PrismaService) {}

  async createMany(repos: BaseRepository) {
    Object.values(repos).forEach(async (element) => {
      await this.prismaService.repository.create({
        data: {
          judul: element.judul,
          pengarang: element.pengarang,
          type: 'EBOOK',
          nama_file: element.nama_file,
          nama_sampul: element.nama_sampul,
          ebook: {
            create: {
              sinopsis: element.sinopsis,
              cetakan: element.cetakan,
              penerbit: element.penerbit,
              tempat_terbit: element.tempat_terbit,
              tahun_terbit: Number(element.tahun_terbit),
              isbn: element.isbn,
            },
          },
        },
      });
    });

    return 'Success create many new e-book repository';
  }

  async create(
    files: Express.Multer.File[],
    repos: BaseRepository,
    request: Ebook,
  ) {
    const filesReposCreate: Record<string, string | null> = {};

    filesReposCreate.nama_sampul = await HandleFileAction(
      null,
      files['sampul'],
      null,
      'ebook',
    );

    filesReposCreate.nama_file = await HandleFileAction(
      null,
      files['repos'],
      null,
      'ebook',
    );

    await this.prismaService.repository.create({
      data: {
        judul: repos.judul,
        type: repos.type,
        pengarang: repos.pengarang,
        ...filesReposCreate,
        ebook: {
          create: {
            ...request,
            tahun_terbit: Number(request.tahun_terbit),
          },
        },
      },
    });

    return 'Success create new e-book repository';
  }

  async update(
    id_repos: number,
    files: Express.Multer.File[],
    repos: BaseRepository,
    request: Ebook,
  ) {
    const filesReposUpdate: Record<string, string | null> = {};

    const data = await this.prismaService.repository.findFirst({
      where: { id: id_repos },
      select: {
        id: true,
        nama_file: true,
        nama_sampul: true,
        ebook: {
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
        'ebook',
      );

      filesReposUpdate.nama_file = await HandleFileAction(
        repos.nama_file,
        files['repos'],
        data.nama_file,
        'ebook',
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
          ebook: {
            update: {
              ...request,
              tahun_terbit: Number(request.tahun_terbit),
            },
          },
        },
      });
    }

    return 'Success update e-book repository';
  }

  async delete(id_repos: number) {
    const data = await this.prismaService.repository.findFirst({
      where: { id: id_repos },
      select: {
        id: true,
        nama_file: true,
        nama_sampul: true,
        ebook: {
          select: {
            id: true,
          },
        },
      },
    });

    if (data.id) {
      await HandleFileDeletation(data.nama_sampul, 'ebook');
      await HandleFileDeletation(data.nama_file, 'ebook');

      await this.prismaService.repository.delete({
        where: { id: data.id, ebook: { id: data.ebook.id } },
      });
    }

    return 'Success delete e-book repository';
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
        ebook: {
          select: {
            id: true,
            tahun_terbit: true,
            isbn: true,
            penerbit: true,
            cetakan: true,
            sinopsis: true,
            tempat_terbit: true,
          },
        },
      },
    });

    if (data) {
      return data;
    }

    throw new HttpException('Repository e-book not found', 400);
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
        type: 'EBOOK',
        OR: request.keyword && rule,
      },
    });

    const ebooks = await this.prismaService.repository.findMany({
      where: {
        type: 'EBOOK',
        OR: request.keyword && rule,
      },
      select: {
        id: true,
        judul: true,
        pengarang: true,
        nama_file: true,
        nama_sampul: true,
        type: true,
        ebook: {
          select: {
            id: true,
            tahun_terbit: true,
            isbn: true,
            penerbit: true,
            cetakan: true,
            sinopsis: true,
            tempat_terbit: true,
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
      repository: ebooks,
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
