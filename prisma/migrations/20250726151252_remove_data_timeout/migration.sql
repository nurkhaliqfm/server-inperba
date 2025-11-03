/*
  Warnings:

  - You are about to drop the column `timeout` on the `session_otp` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `session_otp` DROP COLUMN `timeout`;
