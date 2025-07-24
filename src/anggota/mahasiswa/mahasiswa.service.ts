import { PrismaService } from 'src/common/prisma.service';
import { BaseUser, Mahasiswa } from 'src/model/anggota.model';
import { ValidationService } from 'src/common/validation.service';
import { HttpException, Injectable } from '@nestjs/common';
import { AnggotaValidation } from '../anggota.validation';
import { PaginationRequest } from 'src/model/web.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MahasiswaService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async pagination(request: PaginationRequest) {
    const rule = request.keyword
      ? [
          {
            mahasiswa: {
              nama: {
                contains: request.keyword,
              },
            },
          },
          {
            mahasiswa: {
              nim: {
                contains: request.keyword,
              },
            },
          },
        ]
      : [];

    const totalCount = await this.prismaService.user.count({
      where: {
        id_role: 2,
        OR: request.keyword && rule,
      },
    });

    const mahasiswas = await this.prismaService.user.findMany({
      where: {
        id_role: 2,
        OR: request.keyword && rule,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        mahasiswa: {
          select: {
            nama: true,
            nim: true,
            kontak: true,
            prodi: {
              select: {
                nama: true,
              },
            },
            angkatan: true,
            alamat: true,
            fakultas: true,
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
      anggota: mahasiswas,
      pages: {
        total: totalPages,
        start: startPage,
        end: endPage,
        current: request.page,
      },
    };
  }

  async mahasiswas() {
    const mahasiswas = await this.prismaService.mahasiswa.findMany({
      select: {
        id: true,
        nama: true,
        nim: true,
        kontak: true,
        prodi: true,
        angkatan: true,
        alamat: true,
        fakultas: true,
        jenis_kelamin: true,
      },
    });

    return mahasiswas;
  }

  async detail(id_user: number) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: id_user,
      },
      select: {
        id: true,
        fullname: true,
        email: true,
        mahasiswa: {
          select: {
            nama: true,
            nim: true,
            kontak: true,
            prodi: true,
            angkatan: true,
            alamat: true,
            fakultas: true,
            jenis_kelamin: true,
          },
        },
      },
    });

    if (!user) {
      throw new HttpException('Mahasiswa not found', 400);
    }

    return user;
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
        mahasiswa: {
          select: {
            nama: true,
            nim: true,
            kontak: true,
            prodi: true,
            angkatan: true,
            alamat: true,
            fakultas: true,
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
      mahasiswa: user.mahasiswa,
      transaksi: data,
    };
  }

  async create(user: BaseUser, anggota: Mahasiswa) {
    const mahasiswa: Mahasiswa = this.validationService.validate(
      AnggotaValidation.BASE_MAHASISWA,
      anggota,
    );

    try {
      const cekMahasiswa = await this.prismaService.user.findFirst({
        where: {
          username: mahasiswa.nim,
        },
      });

      if (!cekMahasiswa) {
        const create = await this.prismaService.user.create({
          data: {
            ...user,
            username: mahasiswa.nim,
            id_role: 2,
            password: bcrypt.hashSync(mahasiswa.nim, 10),
            mahasiswa: {
              create: {
                ...mahasiswa,
                angkatan: Number(mahasiswa.angkatan),
                id_prodi: Number(mahasiswa.id_prodi),
              },
            },
          },
          select: {
            id: true,
          },
        });

        if (!create.id) {
          throw new Error('Failed to add mahasiswa');
        }

        return 'Success create mahasiswa';
      } else {
        throw new Error(
          'Failed to add mahasiswa, mahasiswa with nim already exist',
        );
      }
    } catch (error) {
      throw new HttpException(`${error}`, 400);
    }
  }

  async createMany(request: Mahasiswa) {
    Object.values(request).forEach(async (element) => {
      const mahasiswa = await this.prismaService.mahasiswa.findFirst({
        where: {
          nim: element.nim,
        },
        select: { id: true },
      });

      if (mahasiswa) {
        await this.prismaService.mahasiswa.update({
          where: {
            id: mahasiswa.id,
          },
          data: { jenis_kelamin: element.jk === 'p' ? 'P' : 'L' },
        });
      } else {
        await this.prismaService.user.create({
          data: {
            fullname: element.nama,
            username: element.nim,
            password: bcrypt.hashSync(element.nim, 10),
            email: element.email || null,
            id_role: 2,
            mahasiswa: {
              create: {
                id: Number(element.id),
                nama: element.nama,
                nim: element.nim,
                kontak: element.phone || null,
                alamat: element.alamat || null,
                fakultas: element.fakultas,
                id_prodi: Number(element.id_prodi),
                angkatan: Number(element.angkatan),
                jenis_kelamin: element.jenis_kelamin === 'p' ? 'P' : 'L',
              },
            },
          },
        });
      }
    });

    return 'Success create many new mahasiswa';
  }

  async update(id_user: number, user: BaseUser, anggota: Mahasiswa) {
    const mahasiswa = this.validationService.validate(
      AnggotaValidation.MAHASISWA_UPDATE,
      { ...anggota, id: id_user },
    );

    try {
      const mahasiswaById = await this.prismaService.mahasiswa.findFirst({
        where: {
          id_user: mahasiswa.id,
        },
        select: {
          id: true,
        },
      });

      if (mahasiswaById) {
        await this.prismaService.mahasiswa.update({
          where: {
            id: mahasiswaById.id,
          },
          data: {
            ...mahasiswa,
            angkatan: Number(mahasiswa.angkatan),
            id_prodi: Number(mahasiswa.id_prodi),
          },
        });

        return 'Success update mahasiswa';
      } else {
        throw new Error('Failed to update data mahasiswa');
      }
    } catch (error) {
      throw new HttpException(`${error}`, 400);
    }
  }

  async delete(id_user: number) {
    try {
      const mahasiswaById = await this.prismaService.user.findFirst({
        where: {
          id: id_user,
        },
        select: {
          id: true,
        },
      });

      if (mahasiswaById) {
        await this.prismaService.user.delete({
          where: {
            id: mahasiswaById.id,
          },
        });

        return 'Success delete mahasiswa';
      } else {
        throw new Error('Failed to delete mahasiswa');
      }
    } catch (error) {
      throw new HttpException(`${error}`, 400);
    }
  }

  async document(id_user: number) {
    try {
      const anggotaRecordCheck = await this.prismaService.user.findFirst({
        where: {
          id: id_user,
        },
        select: {
          mahasiswa: {
            select: {
              nama: true,
              nim: true,
              fakultas: true,
              prodi: {
                select: {
                  nama: true,
                },
              },
            },
          },
          _count: {
            select: {
              transaksi: {
                where: {
                  status: 'BORROWED',
                },
              },
            },
          },
        },
      });

      if (anggotaRecordCheck._count.transaksi === 0) {
        return anggotaRecordCheck;
      } else {
        throw new Error(
          'Failed to create bebas pustaka document. This anggota has borrowed a repository from the library and has not returned it yet.',
        );
      }
    } catch (error) {
      throw new HttpException(`${error}`, 406);
    }
  }
}
