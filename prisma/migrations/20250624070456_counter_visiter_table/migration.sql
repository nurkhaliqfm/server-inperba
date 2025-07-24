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

-- CreateTable
CREATE TABLE `visitor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` TIMESTAMP(0) NOT NULL,
    `user_agent` VARCHAR(255) NULL,
    `ip_address` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
