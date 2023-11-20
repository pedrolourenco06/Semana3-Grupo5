-- CreateTable
CREATE TABLE `User` (
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'USER',

    PRIMARY KEY (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Artist` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `photo` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `streams` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Music` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `genero` VARCHAR(191) NOT NULL,
    `album` VARCHAR(191) NOT NULL,
    `artistaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Playlist` (
    `userId` VARCHAR(191) NOT NULL,
    `musicId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `musicId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Music` ADD CONSTRAINT `Music_artistaId_fkey` FOREIGN KEY (`artistaId`) REFERENCES `Artist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Playlist` ADD CONSTRAINT `Playlist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Playlist` ADD CONSTRAINT `Playlist_musicId_fkey` FOREIGN KEY (`musicId`) REFERENCES `Music`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
