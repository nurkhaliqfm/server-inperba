-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `fullname` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NULL,
    `password` VARCHAR(255) NOT NULL,
    `id_role` INTEGER NOT NULL,
    `foto` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_authorization_codes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `authorization_codes` VARCHAR(255) NOT NULL,
    `user_agent` VARCHAR(255) NULL,
    `ip_address` VARCHAR(255) NULL,
    `client` VARCHAR(255) NOT NULL,
    `signature` VARCHAR(255) NOT NULL,
    `id_user` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_access_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `access_token` LONGTEXT NOT NULL,
    `access_token_expires_at` BIGINT NOT NULL,
    `id_auth` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `oauth_access_tokens_id_auth_key`(`id_auth`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `oauth_refresh_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `refresh_token` LONGTEXT NOT NULL,
    `refresh_token_expires_at` BIGINT NOT NULL,
    `id_auth` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `oauth_refresh_tokens_id_auth_key`(`id_auth`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mahasiswa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `nim` VARCHAR(255) NOT NULL,
    `kontak` VARCHAR(255) NULL,
    `alamat` VARCHAR(255) NULL,
    `fakultas` VARCHAR(255) NULL,
    `id_prodi` INTEGER NULL,
    `angkatan` INTEGER NOT NULL,
    `jenis_kelamin` ENUM('L', 'P') NOT NULL DEFAULT 'L',
    `id_user` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dosen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `no_identitas` VARCHAR(255) NULL,
    `kontak` VARCHAR(255) NULL,
    `kampus` VARCHAR(255) NULL,
    `jabatan` VARCHAR(255) NULL,
    `alamat` VARCHAR(255) NULL,
    `jenis_kelamin` ENUM('L', 'P') NOT NULL DEFAULT 'L',
    `id_user` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `umum` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `nik` VARCHAR(255) NULL,
    `instansi` VARCHAR(255) NOT NULL,
    `kontak` VARCHAR(255) NOT NULL,
    `alamat` VARCHAR(255) NULL,
    `jenis_kelamin` ENUM('L', 'P') NOT NULL DEFAULT 'L',
    `id_user` INTEGER NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `repository` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul` LONGTEXT NOT NULL,
    `nama_sampul` LONGTEXT NULL,
    `nama_file` LONGTEXT NULL,
    `type` ENUM('EJURNAL', 'JURNAL', 'EBOOK', 'BUKU', 'SKRIPSI') NOT NULL DEFAULT 'BUKU',
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `artikel_jurnal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `abstrak` LONGTEXT NULL,
    `pengarang` LONGTEXT NOT NULL,
    `penerbit` LONGTEXT NULL,
    `jurnal` LONGTEXT NULL,
    `tahun_terbit` INTEGER NOT NULL,
    `isbn` VARCHAR(255) NULL,
    `id_lokasi` INTEGER NULL,
    `id_repository` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `artikel_jurnal_id_repository_key`(`id_repository`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buku` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATETIME NULL,
    `no_regist` VARCHAR(255) NULL,
    `pengarang` LONGTEXT NOT NULL,
    `sinopsis` LONGTEXT NULL,
    `cetakan` VARCHAR(255) NULL,
    `penerbit` LONGTEXT NOT NULL,
    `tempat_terbit` VARCHAR(255) NULL,
    `tahun_terbit` INTEGER NOT NULL,
    `asal_buku` VARCHAR(255) NULL,
    `isbn` VARCHAR(255) NULL,
    `no_klasifikasi` VARCHAR(255) NULL,
    `harga` INTEGER NOT NULL DEFAULT 0,
    `jumlah_buku` INTEGER NOT NULL DEFAULT 0,
    `keterangan` VARCHAR(255) NULL,
    `id_lokasi` INTEGER NULL,
    `id_repository` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `buku_id_repository_key`(`id_repository`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ebook` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pengarang` LONGTEXT NOT NULL,
    `sinopsis` LONGTEXT NULL,
    `cetakan` VARCHAR(255) NULL,
    `penerbit` LONGTEXT NOT NULL,
    `tempat_terbit` VARCHAR(255) NULL,
    `tahun_terbit` INTEGER NOT NULL,
    `isbn` VARCHAR(255) NULL,
    `id_repository` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `ebook_id_repository_key`(`id_repository`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ejurnal` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `abstrak` LONGTEXT NULL,
    `pengarang` LONGTEXT NOT NULL,
    `penerbit` LONGTEXT NULL,
    `jurnal` VARCHAR(255) NULL,
    `tahun_terbit` INTEGER NOT NULL,
    `isbn` VARCHAR(255) NULL,
    `id_repository` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `ejurnal_id_repository_key`(`id_repository`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `skripsi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `abstrak` LONGTEXT NULL,
    `pengarang` LONGTEXT NOT NULL,
    `fakultas` VARCHAR(255) NULL,
    `id_prodi` INTEGER NULL,
    `tahun_terbit` INTEGER NOT NULL,
    `id_lokasi` INTEGER NULL,
    `id_repository` INTEGER NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `skripsi_id_repository_key`(`id_repository`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` INTEGER NOT NULL,
    `id_repository` INTEGER NOT NULL,
    `status` ENUM('BORROWED', 'RETURNED', 'LOST', 'DAMAGED', 'AVAILABLE') NOT NULL DEFAULT 'RETURNED',
    `borrowedAt` DATETIME NULL,
    `returnedAt` DATETIME NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ref_lokasi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ref_prodi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `id_pddikti` VARCHAR(255) NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `oauth_authorization_codes` ADD CONSTRAINT `oauth_authorization_codes_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `oauth_access_tokens` ADD CONSTRAINT `oauth_access_tokens_id_auth_fkey` FOREIGN KEY (`id_auth`) REFERENCES `oauth_authorization_codes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `oauth_refresh_tokens` ADD CONSTRAINT `oauth_refresh_tokens_id_auth_fkey` FOREIGN KEY (`id_auth`) REFERENCES `oauth_authorization_codes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_id_prodi_fkey` FOREIGN KEY (`id_prodi`) REFERENCES `ref_prodi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mahasiswa` ADD CONSTRAINT `mahasiswa_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dosen` ADD CONSTRAINT `dosen_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `umum` ADD CONSTRAINT `umum_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `artikel_jurnal` ADD CONSTRAINT `artikel_jurnal_id_lokasi_fkey` FOREIGN KEY (`id_lokasi`) REFERENCES `ref_lokasi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `artikel_jurnal` ADD CONSTRAINT `artikel_jurnal_id_repository_fkey` FOREIGN KEY (`id_repository`) REFERENCES `repository`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buku` ADD CONSTRAINT `buku_id_lokasi_fkey` FOREIGN KEY (`id_lokasi`) REFERENCES `ref_lokasi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buku` ADD CONSTRAINT `buku_id_repository_fkey` FOREIGN KEY (`id_repository`) REFERENCES `repository`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ebook` ADD CONSTRAINT `ebook_id_repository_fkey` FOREIGN KEY (`id_repository`) REFERENCES `repository`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ejurnal` ADD CONSTRAINT `ejurnal_id_repository_fkey` FOREIGN KEY (`id_repository`) REFERENCES `repository`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skripsi` ADD CONSTRAINT `skripsi_id_prodi_fkey` FOREIGN KEY (`id_prodi`) REFERENCES `ref_prodi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skripsi` ADD CONSTRAINT `skripsi_id_lokasi_fkey` FOREIGN KEY (`id_lokasi`) REFERENCES `ref_lokasi`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `skripsi` ADD CONSTRAINT `skripsi_id_repository_fkey` FOREIGN KEY (`id_repository`) REFERENCES `repository`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_id_repository_fkey` FOREIGN KEY (`id_repository`) REFERENCES `repository`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
