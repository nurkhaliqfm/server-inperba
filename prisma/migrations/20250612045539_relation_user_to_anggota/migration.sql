/*
  Warnings:

  - You are about to alter the column `tanggal` on the `buku` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `borrowedAt` on the `transaksi` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `returnedAt` on the `transaksi` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[id_user]` on the table `dosen` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_user]` on the table `mahasiswa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_user]` on the table `umum` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `dosen` DROP FOREIGN KEY `dosen_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `mahasiswa` DROP FOREIGN KEY `mahasiswa_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `umum` DROP FOREIGN KEY `umum_id_user_fkey`;

-- DropIndex
DROP INDEX `dosen_id_user_fkey` ON `dosen`;

-- DropIndex
DROP INDEX `mahasiswa_id_user_fkey` ON `mahasiswa`;

-- DropIndex
DROP INDEX `umum_id_user_fkey` ON `umum`;

-- AlterTable
ALTER TABLE `buku` MODIFY `tanggal` DATETIME NULL;

-- AlterTable
ALTER TABLE `transaksi` MODIFY `borrowedAt` DATETIME NULL,
    MODIFY `returnedAt` DATETIME NULL;

-- CreateIndex
CREATE UNIQUE INDEX `dosen_id_user_key` ON `dosen`(`id_user`);

-- CreateIndex
CREATE UNIQUE INDEX `mahasiswa_id_user_key` ON `mahasiswa`(`id_user`);

-- CreateIndex
CREATE UNIQUE INDEX `umum_id_user_key` ON `umum`(`id_user`);

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dosen` ADD CONSTRAINT `dosen_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `umum` ADD CONSTRAINT `umum_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
