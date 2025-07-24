/*
  Warnings:

  - You are about to alter the column `tanggal` on the `buku` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `borrowedAt` on the `transaksi` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `returnedAt` on the `transaksi` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `buku` MODIFY `tanggal` DATETIME NULL;

-- AlterTable
ALTER TABLE `transaksi` MODIFY `borrowedAt` DATETIME NULL,
    MODIFY `returnedAt` DATETIME NULL;
