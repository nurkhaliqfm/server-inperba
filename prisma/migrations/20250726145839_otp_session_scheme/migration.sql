-- CreateTable
CREATE TABLE `session_otp` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kontak_wa` VARCHAR(255) NOT NULL,
    `identity` VARCHAR(255) NOT NULL,
    `session` VARCHAR(255) NOT NULL,
    `timeout` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
