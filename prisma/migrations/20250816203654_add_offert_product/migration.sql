/*
  Warnings:

  - You are about to alter the column `reset_code_expires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `offert` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` MODIFY `reset_code_expires` DATETIME NULL;
