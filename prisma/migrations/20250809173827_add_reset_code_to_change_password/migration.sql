-- AlterTable
ALTER TABLE `user` ADD COLUMN `reset_code` VARCHAR(255) NULL,
    ADD COLUMN `reset_code_expires` DATETIME NULL;
