import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { PerkaraRequest } from 'src/model/perkara.model';
import { PaginationRequest } from 'src/model/web.model';
import { PerkaraValidation, UserValidation } from './admin.validation';
import { UpdatePasswordRequest } from 'src/model/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async pagination(request: PaginationRequest) {
    const rule = request.keyword
      ? [
          {
            nomor_perkara: {
              contains: request.keyword,
            },
          },
        ]
      : [];

    const totalCount = await this.prismaService.perkaraBanding.count({
      where: {
        OR: request.keyword && rule,
      },
    });

    const perkara = await this.prismaService.perkaraBanding.findMany({
      where: {
        OR: request.keyword && rule,
      },
      select: {
        id: true,
        kontak_wa: true,
        pembading: true,
        terbanding: true,
        jenis_perkara: true,
        tanggal_registrasi: true,
        nomor_perkara: true,
        status_penetapan_majelis: true,
        tanggal_penetapan_majelis: true,
        status_penunjukan_panitera: true,
        tanggal_penunjukan_panitera: true,
        status_penetapan_sidang: true,
        tanggal_penetapan_sidang: true,
        status_hari_sidang: true,
        tanggal_hari_sidang: true,
        status_proses: true,
        amar_putusan: true,
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
      perkara: perkara,
      total: totalCount,
      pages: {
        total: totalPages,
        start: startPage,
        end: endPage,
        current: request.page,
      },
    };
  }

  async create(data: PerkaraRequest) {
    const perkara = this.validationService.validate(
      PerkaraValidation.REQUEST,
      data,
    );

    try {
      const cekPerkara = await this.prismaService.perkaraBanding.findFirst({
        where: {
          nomor_perkara: perkara.nomor_perkara,
        },
      });

      if (!cekPerkara) {
        const create = await this.prismaService.perkaraBanding.create({
          data: {
            ...perkara,
          },
          select: {
            id: true,
          },
        });

        if (!create.id) {
          throw new Error('Failed to add perkara information');
        }

        return 'Success create perkara information';
      } else {
        throw new Error(
          'Failed to add perkara, perkara already exist with the same perkara number',
        );
      }
    } catch (error) {
      throw new HttpException(`${error}`, 400);
    }
  }

  async detail(perkara: number) {
    const data = await this.prismaService.perkaraBanding.findFirst({
      where: {
        id: perkara,
      },
      select: {
        id: true,
        kontak_wa: true,
        pembading: true,
        terbanding: true,
        jenis_perkara: true,
        tanggal_registrasi: true,
        nomor_perkara: true,
        status_penetapan_majelis: true,
        tanggal_penetapan_majelis: true,
        status_penunjukan_panitera: true,
        tanggal_penunjukan_panitera: true,
        status_penetapan_sidang: true,
        tanggal_penetapan_sidang: true,
        status_hari_sidang: true,
        tanggal_hari_sidang: true,
        status_proses: true,
        amar_putusan: true,
      },
    });

    if (!data)
      throw new HttpException(`You don't have access to this information`, 400);

    return data;
  }

  async update(id_perkara: number, data: PerkaraRequest) {
    const perkara = this.validationService.validate(
      PerkaraValidation.REQUEST,
      data,
    );

    try {
      const perkaraById = await this.prismaService.perkaraBanding.findFirst({
        where: {
          id: id_perkara,
        },
        select: {
          id: true,
        },
      });

      if (perkaraById) {
        await this.prismaService.perkaraBanding.update({
          where: {
            id: perkaraById.id,
          },
          data: {
            ...perkara,
          },
        });

        return 'Success update perkara information';
      } else {
        throw new Error('Failed to update perkara information');
      }
    } catch (error) {
      throw new HttpException(`${error}`, 400);
    }
  }

  async delete(id_perkara: number) {
    try {
      const perkaraById = await this.prismaService.perkaraBanding.findFirst({
        where: {
          id: id_perkara,
        },
        select: {
          id: true,
        },
      });

      if (perkaraById) {
        await this.prismaService.perkaraBanding.delete({
          where: {
            id: perkaraById.id,
          },
        });

        return 'Success delete perkara information';
      } else {
        throw new Error('Failed to delete perkara information');
      }
    } catch (error) {
      throw new HttpException(`${error}`, 400);
    }
  }

  async password(id: number, body: UpdatePasswordRequest) {
    const data = this.validationService.validate(
      UserValidation.UPDATE_PASSWORD,
      { id_user: id, ...body },
    );

    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: data.id_user },
      });

      if (!user) {
        throw new Error('User not found.');
      }

      const isPasswordMatch = await bcrypt.compare(
        data.password,
        user.password,
      );

      if (!isPasswordMatch) {
        throw new Error(
          'Failed to update password because your last password is incorect ',
        );
      }

      const hashedPassword = await bcrypt.hash(data.newpassword, 10);
      await this.prismaService.user.update({
        where: {
          id: data.id_user,
        },
        data: {
          password: hashedPassword,
        },
      });

      return 'Password update successfully';
    } catch (error) {
      throw new HttpException(`${error}`, 400);
    }
  }
}
