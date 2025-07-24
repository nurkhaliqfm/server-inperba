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
CREATE TABLE `perkara_banding` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kontak_wa` VARCHAR(255) NOT NULL,
    `nomor_perkara` LONGTEXT NOT NULL,
    `tanggal_registrasi` TIMESTAMP(0) NOT NULL,
    `status_penetapan_majelis` BOOLEAN NOT NULL DEFAULT false,
    `tanggal_penetapan_majelis` TIMESTAMP(0) NULL,
    `status_penunjukan_panitera` BOOLEAN NOT NULL DEFAULT false,
    `tanggal_penunjukan_panitera` TIMESTAMP(0) NULL,
    `status_penetapan_sidang` BOOLEAN NOT NULL DEFAULT false,
    `tanggal_penetapan_sidang` TIMESTAMP(0) NULL,
    `status_hari_sidang` BOOLEAN NOT NULL DEFAULT false,
    `tanggal_hari_sidang` TIMESTAMP(0) NULL,
    `status_proses` ENUM('PROSES', 'SELESAI') NOT NULL DEFAULT 'PROSES',
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
