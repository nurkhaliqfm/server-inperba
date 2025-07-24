/*
  Warnings:

  - You are about to drop the column `pengarang` on the `artikel_jurnal` table. All the data in the column will be lost.
  - You are about to drop the column `pengarang` on the `buku` table. All the data in the column will be lost.
  - You are about to alter the column `tanggal` on the `buku` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `pengarang` on the `ebook` table. All the data in the column will be lost.
  - You are about to drop the column `pengarang` on the `ejurnal` table. All the data in the column will be lost.
  - You are about to drop the column `pengarang` on the `skripsi` table. All the data in the column will be lost.
  - You are about to alter the column `borrowedAt` on the `transaksi` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `returnedAt` on the `transaksi` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `artikel_jurnal` DROP COLUMN `pengarang`;

-- AlterTable
ALTER TABLE `buku` DROP COLUMN `pengarang`,
    MODIFY `tanggal` DATETIME NULL;

-- AlterTable
ALTER TABLE `ebook` DROP COLUMN `pengarang`;

-- AlterTable
ALTER TABLE `ejurnal` DROP COLUMN `pengarang`;

-- AlterTable
ALTER TABLE `skripsi` DROP COLUMN `pengarang`;

-- AlterTable
ALTER TABLE `transaksi` MODIFY `borrowedAt` DATETIME NULL,
    MODIFY `returnedAt` DATETIME NULL;
