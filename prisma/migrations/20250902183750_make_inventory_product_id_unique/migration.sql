/*
  Warnings:

  - You are about to alter the column `deleted_at` on the `product` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `reset_code_expires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `deleted_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `reset_code_expires` DATETIME NULL;
