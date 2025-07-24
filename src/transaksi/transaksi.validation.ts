import { z, ZodType } from 'zod';

export class TransaksiValidation {
  static readonly BASE_TRANSAKSI: ZodType = z.object({
    user: z.number(),
    repos: z.number(),
    type: z.enum(['JURNAL', 'BUKU', 'SKRIPSI']),
    status: z.enum(['BORROWED', 'RETURNED', 'LOST', 'DAMAGED', 'AVAILABLE']),
    brrowedAt: z.date().nullable().optional(),
    returnedAt: z.date().nullable().optional(),
  });

  static readonly TRANSAKSI_UPDATE: ZodType = z.intersection(
    TransaksiValidation.BASE_TRANSAKSI,
    z.object({
      id: z.number(),
    }),
  );
}
