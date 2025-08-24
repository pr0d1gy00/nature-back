/*
  Warnings:

  - The values [audio] on the enum `ProductMedia_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [audio] on the enum `ProductMedia_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `reset_code_expires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `historymedia` MODIFY `type` ENUM('image', 'video') NOT NULL DEFAULT 'image';

-- AlterTable
ALTER TABLE `product` ADD COLUMN `deleted_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `productmedia` MODIFY `type` ENUM('image', 'video') NOT NULL DEFAULT 'image';

-- AlterTable
ALTER TABLE `user` MODIFY `reset_code_expires` DATETIME NULL;
