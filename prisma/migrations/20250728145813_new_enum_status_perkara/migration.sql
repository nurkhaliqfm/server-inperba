/*
  Warnings:

  - The values [SELESAI] on the enum `perkara_banding_status_proses` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `perkara_banding` MODIFY `status_proses` ENUM('PROSES', 'PUTUS', 'BANDING', 'KASASI', 'INKRAH', 'DICABUT', 'TIDAK_DAPAT_DITERIMA', 'DITOLAK', 'DIKABULKAN', 'MENUNGGU_JADWAL_SIDANG', 'ARSIP') NOT NULL DEFAULT 'PROSES';
