import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { TransaksiRequest } from 'src/model/transaksi.model';
import { parseDateString } from 'src/utils/parse_date_string.utils';
import { TransaksiValidation } from './transaksi.validation';
import { PaginationRequest } from 'src/model/web.model';

@Injectable()
export class TransaksiService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async createMany(request: TransaksiRequest) {
    Object.values(request).forEach(async (element) => {
      const repositoryCheck = await this.prismaService.repository.findFirst({
        where: {
          judul: {
            contains: element.judul.trim(),
          },
        },
        select: { id: true, judul: true },
      });

      if (repositoryCheck) {
        const users = await this.prismaService.user.findFirst({
          where: {
            fullname: {
              contains: element.nama.trim(),
            },
          },
          select: { id: true },
        });

        if (users) {
          await this.prismaService.transaksi.create({
            data: {
              id_user: users.id,
              id_repository: repositoryCheck.id,
              borrowedAt: parseDateString(element.tgl_pinjam),
              returnedAt: parseDateString(element.tgl_kembali),
              status: element.ket === 'pinjam' ? 'BORROWED' : 'RETURNED',
            },
          });
        }
      }
    });
  }

  async create(request: TransaksiRequest) {
    const transaksi = this.validationService.validate(
      TransaksiValidation.BASE_TRANSAKSI,
      request,
    );

    const repositoryCheck = await this.prismaService.repository.findFirst({
      where: {
        id: transaksi.repos,
        ...(transaksi.type === 'BUKU' && {
          buku: {
            jumlah_buku: { gt: 1 },
          },
        }),
      },
      select: { id: true, buku: true, jurnal: true, skripsi: true },
    });

    if (!repositoryCheck) {
      throw new HttpException(
        'Repository not found or insufficient stock',
        400,
      );
    }

    const users = await this.prismaService.user.findFirst({
      where: {
        id: transaksi.user,
      },
      select: { id: true },
    });

    if (!users) {
      throw new HttpException('User not found', 400);
    }

    if (transaksi.type === 'BUKU') {
      await this.prismaService.buku.update({
        where: { id: repositoryCheck.buku.id },
        data: {
          jumlah_buku: repositoryCheck.buku.jumlah_buku - 1,
        },
      });
    }

    await this.prismaService.transaksi.create({
      data: {
        id_user: users.id,
        id_repository: repositoryCheck.id,
        borrowedAt: transaksi.brrowedAt,
        returnedAt: transaksi.returnedAt,
        status: transaksi.status,
      },
    });

    return 'Success record transaksi repository';
  }

  async delete(id_transaksi: number) {
    const repositoryCheck = await this.prismaService.transaksi.findFirst({
      where: {
        id: id_transaksi,
      },
      select: { id: true, status: true },
    });

    if (!repositoryCheck) {
      throw new HttpException(
        'Repository not found or insufficient stock',
        400,
      );
    }

    if (repositoryCheck.status === 'BORROWED') {
      throw new HttpException(
        'Repository not returned yet. This transaction cannot be deleted',
        400,
      );
    }

    await this.prismaService.transaksi.delete({
      where: {
        id: id_transaksi,
      },
    });

    return { message: 'Success delete repository transaction' };
  }

  async update(id_transaksi: number, request: TransaksiRequest) {
    const transaksi = this.validationService.validate(
      TransaksiValidation.TRANSAKSI_UPDATE,
      { id: id_transaksi, ...request },
    );

    const repositoryCheck = await this.prismaService.repository.findFirst({
      where: {
        id: transaksi.repos,
        ...(transaksi.type === 'BUKU' && {
          buku: {
            jumlah_buku: { gt: 1 },
          },
        }),
      },
      select: { id: true, buku: true, jurnal: true, skripsi: true },
    });

    if (!repositoryCheck) {
      throw new HttpException(
        'Repository not found or insufficient stock',
        400,
      );
    }

    const users = await this.prismaService.user.findFirst({
      where: {
        id: transaksi.user,
      },
      select: { id: true },
    });

    if (!users) {
      throw new HttpException('User not found', 400);
    }

    const transaksiCheck = await this.prismaService.transaksi.findFirst({
      where: {
        id: id_transaksi,
      },
      select: {
        id: true,
        status: true,
        repository: {
          select: { type: true, buku: true, jurnal: true, skripsi: true },
        },
      },
    });

    if (!transaksiCheck) {
      throw new HttpException('Transaction not found', 400);
    }

    if (transaksi.type === 'BUKU') {
      await this.prismaService.buku.update({
        where: { id: repositoryCheck.buku.id },
        data: {
          jumlah_buku: repositoryCheck.buku.jumlah_buku - 1,
        },
      });
    }

    if (transaksiCheck.repository.type === 'BUKU') {
      await this.prismaService.buku.update({
        where: { id: transaksiCheck.repository.buku.id },
        data: {
          jumlah_buku: transaksiCheck.repository.buku.jumlah_buku + 1,
        },
      });
    }

    await this.prismaService.transaksi.update({
      where: {
        id: transaksi.id,
      },
      data: {
        // id_user: users.id,
        id_repository: repositoryCheck.id,
        // borrowedAt: transaksi.brrowedAt,
        // returnedAt: transaksi.returnedAt,
        // status: transaksi.status,
      },
    });

    return { message: 'Success update record transaksi repository' };
  }

  async returned(id_transaksi: number, request: TransaksiRequest) {
    const transaksi = this.validationService.validate(
      TransaksiValidation.TRANSAKSI_UPDATE,
      { id: id_transaksi, ...request },
    );

    const repositoryCheck = await this.prismaService.repository.findFirst({
      where: {
        id: transaksi.repos,
        ...(transaksi.type === 'BUKU' && {
          buku: {
            jumlah_buku: { gt: 1 },
          },
        }),
      },
      select: { id: true, buku: true, jurnal: true, skripsi: true },
    });

    if (!repositoryCheck) {
      throw new HttpException(
        'Repository not found or insufficient stock',
        400,
      );
    }

    const users = await this.prismaService.user.findFirst({
      where: {
        id: transaksi.user,
      },
      select: { id: true },
    });

    if (!users) {
      throw new HttpException('User not found', 400);
    }

    if (transaksi.type === 'BUKU') {
      await this.prismaService.buku.update({
        where: { id: repositoryCheck.buku.id },
        data: {
          jumlah_buku: repositoryCheck.buku.jumlah_buku + 1,
        },
      });
    }

    await this.prismaService.transaksi.update({
      where: {
        id: transaksi.id,
      },
      data: {
        status: transaksi.status,
      },
    });

    return { message: 'Success update record transaksi repository' };
  }

  async extended(id_transaksi: number, request: TransaksiRequest) {
    const transaksi = this.validationService.validate(
      TransaksiValidation.TRANSAKSI_UPDATE,
      { id: id_transaksi, ...request },
    );

    const repositoryCheck = await this.prismaService.repository.findFirst({
      where: {
        id: transaksi.repos,
      },
      select: { id: true },
    });

    if (!repositoryCheck) {
      throw new HttpException(
        'Repository not found or insufficient stock',
        400,
      );
    }

    const users = await this.prismaService.user.findFirst({
      where: {
        id: transaksi.user,
      },
      select: { id: true },
    });

    if (!users) {
      throw new HttpException('User not found', 400);
    }

    const getTransaksi = await this.prismaService.transaksi.findFirst({
      where: {
        id: transaksi.id,
      },
      select: { id: true, returnedAt: true },
    });

    if (!getTransaksi) {
      throw new HttpException('Transaksi not found', 400);
    }

    const returnedAt = new Date(getTransaksi.returnedAt);
    const nextWeek = new Date(returnedAt);
    nextWeek.setDate(returnedAt.getDate() + 7);

    await this.prismaService.transaksi.update({
      where: {
        id: transaksi.id,
      },
      data: {
        status: transaksi.status,
        returnedAt: nextWeek,
      },
    });

    return { message: 'Success update record transaksi repository' };
  }

  async pagination(request: PaginationRequest) {
    const rule = [
      {
        user: {
          fullname: request.keyword
            ? {
                contains: request.keyword,
              }
            : undefined,
        },
      },
      {
        repository: {
          judul: request.keyword
            ? {
                contains: request.keyword,
              }
            : undefined,
        },
      },
    ];

    const totalCount = await this.prismaService.transaksi.count({
      where: {
        status: request.slug as
          | 'BORROWED'
          | 'RETURNED'
          | 'LOST'
          | 'DAMAGED'
          | 'AVAILABLE',
        OR: request.keyword && rule,
      },
    });

    const transaksi = await this.prismaService.transaksi.findMany({
      where: {
        status: request.slug as
          | 'BORROWED'
          | 'RETURNED'
          | 'LOST'
          | 'DAMAGED'
          | 'AVAILABLE',
        OR: request.keyword && rule,
      },
      select: {
        id: true,
        borrowedAt: true,
        returnedAt: true,
        status: true,
        user: {
          select: {
            id: true,
            fullname: true,
            id_role: true,
            email: true,
          },
        },
        repository: {
          select: {
            id: true,
            judul: true,
            type: true,
            pengarang: true,
            nama_sampul: true,
            nama_file: true,
          },
        },
      },
      skip: (request.page - 1) * request.limit,
      take: request.limit,
      orderBy: [
        { borrowedAt: 'asc' },
        { repository: { judul: 'asc' } },
        { user: { fullname: 'asc' } },
      ],
    });

    const today = new Date();
    const data = transaksi.map((t) => {
      const returnedAt = new Date(t.returnedAt!);
      const diffMs = today.getTime() - returnedAt.getTime();
      const overdueDays = Math.max(
        Math.floor(diffMs / (1000 * 60 * 60 * 24)),
        0,
      );

      return {
        ...t,
        overdue_days: overdueDays,
        denda: overdueDays * 2000,
      };
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
      transaksi: data,
      total: totalCount,
      pages: {
        total: totalPages,
        start: startPage,
        end: endPage,
        current: request.page,
      },
    };
  }

  async detail(id_transaksi: number) {
    const transaksi = await this.prismaService.transaksi.findFirst({
      where: { id: id_transaksi },
      select: {
        id: true,
        borrowedAt: true,
        returnedAt: true,
        status: true,
        user: {
          select: {
            id: true,
            fullname: true,
            id_role: true,
            email: true,
          },
        },
        repository: {
          select: {
            id: true,
            judul: true,
            type: true,
            pengarang: true,
          },
        },
      },
    });

    if (transaksi) {
      const today = new Date();
      const returnedAt = new Date(transaksi.returnedAt!);
      const diffMs = today.getTime() - returnedAt.getTime();
      const overdueDays = Math.max(
        Math.floor(diffMs / (1000 * 60 * 60 * 24)),
        0,
      );

      return {
        ...transaksi,
        overdue_days: overdueDays,
        denda: overdueDays * 2000,
      };
    }

    throw new HttpException('Repository e-book not found', 400);
  }
}
