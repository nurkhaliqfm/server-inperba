import { z, ZodType } from 'zod';

export class PerkaraValidation {
  static readonly REQUEST: ZodType = z.object({
    kontak_wa: z
      .string({
        required_error: 'Phone number is required',
        invalid_type_error: 'Phone number must be a string',
      })
      .trim()
      .min(12, { message: 'Phone number is too short (min 11 digits)' })
      .max(14, { message: 'Phone number is too long (max 14 digits)' })
      .regex(/^628[0-9]{9,11}$/, {
        message: 'Phone number must start with 628 and be valid',
      }),
    nomor_perkara: z
      .string({
        required_error: 'Nomor perkara is required',
        invalid_type_error: 'Nomor perkara must be a string',
      })
      .regex(/^\S+$/, {
        message: `Nomor perkara may only contain letters, numbers, and symbols '/', '.', '-'`,
      }),
    tanggal_registrasi: z
      .string({
        required_error: 'Tanggal registrasi is required',
        invalid_type_error: 'Tanggal registrasi must be a string',
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Format tanggal registrasi tidak valid',
      }),
    jenis_perkara: z.enum(['Lain-Lain'], {
      required_error: 'Jenis Perkara is required',
      invalid_type_error: 'Jenis Perkara must Lain-Lain',
    }),
    pembading: z.string({
      required_error: 'Nama pembading is required',
      invalid_type_error: 'Nama pembading must be a string',
    }),
    terbanding: z.string({
      required_error: 'Nama terbanding is required',
      invalid_type_error: 'Nama terbanding must be a string',
    }),
    tanggal_hari_sidang: z
      .string({
        required_error: 'Tanggal hari sidang is required',
        invalid_type_error: 'Tanggal hari sidang must be a string',
      })
      .nullable()
      .refine((val) => val === null || !isNaN(Date.parse(val)), {
        message: 'Format Tanggal hari sidang tidak valid',
      }),
    status_proses: z.enum(
      [
        'PROSES',
        'PUTUS',
        'BANDING',
        'KASASI',
        'INKRAH',
        'DICABUT',
        'TIDAK_DAPAT_DITERIMA',
        'DITOLAK',
        'DIKABULKAN',
        'MENUNGGU_JADWAL_SIDANG',
        'ARSIP',
      ],
      {
        required_error: 'Status proses is required',
        invalid_type_error: 'Status proses is not valid',
      },
    ),
    amar_putusan: z.string({
      required_error: 'Nomor perkara is required',
      invalid_type_error: 'Nomor perkara must be a string',
    }),
  });
}

export class UserValidation {
  static readonly UPDATE_PASSWORD: ZodType = z
    .object({
      id_user: z
        .number({ invalid_type_error: 'User ID must be a number' })
        .int('User ID must be an integer')
        .positive('User ID must be a positive number'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      newpassword: z
        .string()
        .min(8, 'New password must be at least 8 characters'),
    })
    .refine((data) => data.password !== data.newpassword, {
      path: ['newpassword'],
      message: 'New password must be different from current password',
    });
}
