import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { AnggotaValidation } from '../anggota.validation';
import { BaseUser, Dosen } from 'src/model/anggota.model';
import { PaginationRequest } from 'src/model/web.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DosenService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async pagination(request: PaginationRequest) {
    const rule = request.keyword
      ? [
          {
            dosen: {
              nama: {
                contains: request.keyword,
              },
            },
          },
          {
            dosen: {
              no_identitas: {
                contains: request.keyword,
              },
            },
          },
        ]
      : [];

    const totalCount = await this.prismaService.user.count({
      where: {
        id_role: 4,
        OR: request.keyword && rule,
      },
    });

    const dosens = await this.prismaService.user.findMany({
      where: {
        id_role: 4,
        OR: request.keyword && rule,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        dosen: {
          select: {
            nama: true,
            no_identitas: true,
            jabatan: true,
            kontak: true,
            kampus: true,
            alamat: true,
            jenis_kelamin: true,
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
      anggota: dosens,
      pages: {
        total: totalPages,
        start: startPage,
        end: endPage,
        current: request.page,
      },
    };
  }

  async dosens() {
    const dosens = await this.prismaService.dosen.findMany({
      select: {
        id: true,
        nama: true,
        jabatan: true,
        kontak: true,
        kampus: true,
        alamat: true,
        jenis_kelamin: true,
      },
    });

    return dosens;
  }

  async detail(id_user: number) {
    const dosen = await this.prismaService.user.findFirst({
      where: {
        id: id_user,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        dosen: {
          select: {
            nama: true,
            no_identitas: true,
            jabatan: true,
            kontak: true,
            kampus: true,
            alamat: true,
            jenis_kelamin: true,
          },
        },
      },
    });

    if (!dosen) {
      throw new HttpException('Dosen not found', 400);
    }

    return dosen;
  }

  async transaksi(id_user: number) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: id_user,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        dosen: {
          select: {
            nama: true,
            no_identitas: true,
            jabatan: true,
            kontak: true,
            kampus: true,
            alamat: true,
            jenis_kelamin: true,
          },
        },
        transaksi: {
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
          orderBy: [{ status: 'asc' }, { returnedAt: 'asc' }],
        },
      },
    });

    if (!user) {
      throw new HttpException('Mahasiswa not found', 400);
    }

    const today = new Date();
    const data = user.transaksi.map((t) => {
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

    return {
      ...user,
      dosen: user.dosen,
      transaksi: data,
    };
  }

  async create(user: BaseUser, anggota: Dosen) {
    const dosen = this.validationService.validate(
      AnggotaValidation.BASE_DOSEN,
      anggota,
    );

    try {
      const cekDosen = await this.prismaService.user.findFirst({
        where: {
          username: dosen.no_identitas,
        },
      });

      if (!cekDosen) {
        const create = await this.prismaService.user.create({
          data: {
            ...user,
            username: dosen.no_identitas,
            id_role: 4,
            password: bcrypt.hashSync(dosen.no_identitas, 10),
            dosen: {
              create: {
                ...dosen,
              },
            },
          },
          select: {
            id: true,
          },
        });

        if (!create.id) {
          throw new Error('Failed to add dosen');
        }

        return 'Success create dosen';
      } else {
        throw new Error(
          'Failed to add dosen, dosen already exist with the same phone number',
        );
      }
    } catch (error) {
      throw new HttpException(`${error}`, 400);
    }
  }

  async createMany(request: Dosen) {
    Object.values(request).forEach(async (element) => {
      const dosen = await this.prismaService.dosen.findFirst({
        where: {
          no_identitas: element.no_identitas,
        },
        select: { id: true },
      });

      if (dosen) {
        await this.prismaService.dosen.update({
          where: {
            id: dosen.id,
          },
          data: { jenis_kelamin: element.jk === 'p' ? 'P' : 'L' },
        });
      } else {
        await this.prismaService.user.create({
          data: {
            fullname: element.nama,
            username: element.no_identitas,
            password: bcrypt.hashSync(element.no_identitas, 10),
            email: element.email || null,
            id_role: 4,
            dosen: {
              create: {
                id: Number(element.id),
                nama: element.nama,
                jabatan: element.jabatan || null,
                kontak: element.phone || null,
                kampus: element.kampus || null,
                no_identitas: element.no_identitas || null,
                alamat: element.alamat || null,
                jenis_kelamin: element.jk === 'p' ? 'P' : 'L',
              },
            },
          },
        });
      }
    });

    return 'Success create many new dosen';
  }

  async update(id_dosen: number, user: BaseUser, anggota: Dosen) {
    const dosen = this.validationService.validate(
      AnggotaValidation.DOSEN_UPDATE,
      { ...anggota, id: id_dosen },
    );

    try {
      const dosenById = await this.prismaService.dosen.findFirst({
        where: {
          id_user: id_dosen,
        },
        select: {
          id: true,
        },
      });

      if (dosenById) {
        await this.prismaService.dosen.update({
          where: {
            id: dosenById.id,
          },
          data: dosen,
        });

        return 'Success update dosen';
      } else {
        throw new Error('Failed to update data dosen');
      }
    } catch (error) {
      throw new HttpException(`${error}`, 400);
    }
  }

  async delete(id_user: number) {
    try {
      const dosenById = await this.prismaService.user.findFirst({
        where: {
          id: id_user,
        },
        select: {
          id: true,
        },
      });

      if (dosenById) {
        await this.prismaService.user.delete({
          where: {
            id: dosenById.id,
          },
        });

        return 'Success delete dosen';
      } else {
        throw new Error('Failed to delete dosen');
      }
    } catch (error) {
      throw new HttpException(`${error}`, 400);
    }
  }
}
