/*
  Warnings:

  - You are about to alter the column `deleted_at` on the `product` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `reset_code_expires` on the `user` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - A unique constraint covering the columns `[product_id]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `deleted_at` DATETIME NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `reset_code_expires` DATETIME NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Inventory_product_id_key` ON `Inventory`(`product_id`);
