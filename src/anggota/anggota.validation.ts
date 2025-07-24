import { z, ZodType } from 'zod';

export class AnggotaValidation {
  static readonly BASE_ANGGOTA: ZodType = z.object({
    nama: z.string().min(1).max(200),
    kontak: z.string(),
    alamat: z.string(),
    jenis_kelamin: z.enum(['L', 'P']),
  });

  static readonly BASE_MAHASISWA: ZodType = z.intersection(
    AnggotaValidation.BASE_ANGGOTA,
    z.object({
      nim: z.string().min(1).max(200),
      fakultas: z.string().optional(),
      id_prodi: z.number(),
      angkatan: z.number(),
    }),
  );

  static readonly MAHASISWA_UPDATE: ZodType = z.intersection(
    AnggotaValidation.BASE_MAHASISWA,
    z.object({
      id: z.number(),
    }),
  );

  static readonly BASE_DOSEN: ZodType = z.intersection(
    AnggotaValidation.BASE_ANGGOTA,
    z.object({
      no_identitas: z.string(),
      kampus: z.string(),
      jabatan: z.string(),
    }),
  );

  static readonly DOSEN_UPDATE: ZodType = z.intersection(
    AnggotaValidation.BASE_DOSEN,
    z.object({
      id: z.number(),
    }),
  );

  static readonly BASE_UMUM: ZodType = z.intersection(
    AnggotaValidation.BASE_ANGGOTA,
    z.object({
      nik: z.string(),
      instansi: z.string(),
    }),
  );

  static readonly UMUM_UPDATE: ZodType = z.intersection(
    AnggotaValidation.BASE_UMUM,
    z.object({
      id: z.number(),
    }),
  );
}
