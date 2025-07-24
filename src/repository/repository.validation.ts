import { z, ZodType } from 'zod';

export class RepositoryValidation {
  static readonly BASE_REPOSITORY: ZodType = z.object({
    judul: z.string().min(1),
    pengarang: z.string(),
    nama_sampul: z.string(),
    nama_file: z.string(),
    type: z.enum(['EJURNAL', 'JURNAL', 'EBOOK', 'BUKU', 'SKRIPSI']),
  });

  // static readonly BASE_MAHASISWA: ZodType = z.intersection(
  //   RepositoryValidation.BASE_REPOSITORY,
  //   z.object({
  //     nim: z.string().min(1).max(200),
  //     fakultas: z.string().optional(),
  //     id_prodi: z.number(),
  //     angkatan: z.number(),
  //   }),
  // );

  // static readonly MAHASISWA_UPDATE: ZodType = z.intersection(
  //   RepositoryValidation.BASE_MAHASISWA,
  //   z.object({
  //     id: z.number(),
  //   }),
  // );

  // static readonly BASE_DOSEN: ZodType = z.intersection(
  //   RepositoryValidation.BASE_REPOSITORY,
  //   z.object({
  //     no_identitas: z.string(),
  //     kampus: z.string(),
  //     jabatan: z.string(),
  //   }),
  // );

  // static readonly DOSEN_UPDATE: ZodType = z.intersection(
  //   RepositoryValidation.BASE_DOSEN,
  //   z.object({
  //     id: z.number(),
  //   }),
  // );

  // static readonly BASE_UMUM: ZodType = z.intersection(
  //   RepositoryValidation.BASE_REPOSITORY,
  //   z.object({
  //     nik: z.string(),
  //     instansi: z.string(),
  //   }),
  // );

  // static readonly UMUM_UPDATE: ZodType = z.intersection(
  //   RepositoryValidation.BASE_UMUM,
  //   z.object({
  //     id: z.number(),
  //   }),
  // );
}
