import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { AnggotaValidation } from '../anggota.validation';
import { BaseUser, Umum } from 'src/model/anggota.model';
import { PaginationRequest } from 'src/model/web.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UmumService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async pagination(request: PaginationRequest) {
    const rule = request.keyword
      ? [
          {
            umum: {
              nama: {
                contains: request.keyword,
              },
            },
          },
          {
            umum: {
              nik: {
                contains: request.keyword,
              },
            },
          },
        ]
      : [];

    const totalCount = await this.prismaService.user.count({
      where: {
        id_role: 3,
        OR: request.keyword && rule,
      },
    });

    const umums = await this.prismaService.user.findMany({
      where: {
        id_role: 3,
        OR: request.keyword && rule,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        umum: {
          select: {
            nama: true,
            instansi: true,
            nik: true,
            kontak: true,
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
      anggota: umums,
      pages: {
        total: totalPages,
        start: startPage,
        end: endPage,
        current: request.page,
      },
    };
  }

  async umums() {
    const umum = await this.prismaService.umum.findMany({
      select: {
        id: true,
        nama: true,
        nik: true,
        kontak: true,
        alamat: true,
        jenis_kelamin: true,
      },
    });

    return umum;
  }

  async detail(id_user: number) {
    const umum = await this.prismaService.user.findFirst({
      where: {
        id: id_user,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        umum: {
          select: {
            nama: true,
            instansi: true,
            nik: true,
            kontak: true,
            alamat: true,
            jenis_kelamin: true,
          },
        },
      },
    });

    if (!umum) {
      throw new HttpException('Anggota umum not found', 400);
    }

    return umum;
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
        umum: {
          select: {
            nama: true,
            instansi: true,
            nik: true,
            kontak: true,
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
      mahasiswa: user.umum,
      transaksi: data,
    };
  }

  async create(user: BaseUser, anggota: Umum) {
    const umum = this.validationService.validate(
      AnggotaValidation.BASE_UMUM,
      anggota,
    );

    try {
      const cekUmum = await this.prismaService.user.findFirst({
        where: {
          username: umum.nik,
        },
      });

      if (!cekUmum) {
        const create = await this.prismaService.user.create({
          data: {
            ...user,
            username: umum.nik,
            id_role: 3,
            password: bcrypt.hashSync(umum.nik, 10),
            umum: {
              create: {
                ...umum,
              },
            },
          },
          select: {
            id: true,
          },
        });

        if (!create.id) {
          throw new Error('Failed to add anggota umum');
        }

        return 'Success create anggota umum';
      } else {
        throw new Error(
          'Failed to add anggota umum, anggote with NIK already exist',
        );
      }
    } catch (error) {
      throw new HttpException(`${error}`, 400);
    }
  }

  async createMany(request: Umum) {
    Object.values(request).forEach(async (element) => {
      const umum = await this.prismaService.umum.findFirst({
        where: {
          nik: element.nik,
        },
        select: { id: true },
      });

      if (umum) {
        await this.prismaService.umum.update({
          where: {
            id: umum.id,
          },
          data: { jenis_kelamin: element.jk === 'p' ? 'P' : 'L' },
        });
      } else {
        await this.prismaService.user.create({
          data: {
            fullname: element.nama,
            username: element.nik,
            password: bcrypt.hashSync(element.nik, 10),
            email: element.email || null,
            id_role: 3,
            umum: {
              create: {
                id: Number(element.id),
                nama: element.nama,
                nik: element.nik,
                instansi: element.instansi,
                kontak: element.phone || null,
                alamat: null,
                jenis_kelamin: element.jenis_kelamin === 'p' ? 'P' : 'L',
              },
            },
          },
        });
      }
    });

    return 'Success create many new anggota umum';
  }

  async update(id_user: number, user: BaseUser, anggota: Umum) {
    const umum = this.validationService.validate(
      AnggotaValidation.UMUM_UPDATE,
      { ...anggota, id: id_user },
    );

    try {
      const umumById = await this.prismaService.umum.findFirst({
        where: {
          id_user: umum.id,
        },
        select: {
          id: true,
        },
      });

      if (umumById) {
        await this.prismaService.umum.update({
          where: {
            id: umumById.id,
          },
          data: { ...umum },
        });

        return 'Success update anggota umum';
      } else {
        throw new Error('Failed to update data anggota umum');
      }
    } catch (error) {
      throw new HttpException(`${error}`, 400);
    }
  }

  async delete(id_user: number) {
    try {
      const umumById = await this.prismaService.user.findFirst({
        where: {
          id: id_user,
        },
        select: {
          id: true,
        },
      });

      if (umumById) {
        await this.prismaService.user.delete({
          where: {
            id: umumById.id,
          },
        });

        return 'Success delete anggota umum';
      } else {
        throw new Error('Failed to delete anggota umum');
      }
    } catch (error) {
      throw new HttpException(`${error}`, 400);
    }
  }
}
