-- CreateTable
CREATE TABLE `ExchangeAccount` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `exchange` ENUM('BINANCE') NOT NULL,
    `apiKeyEncrypted` TEXT NOT NULL,
    `apiSecretEncrypted` TEXT NOT NULL,
    `status` ENUM('CONNECTED', 'DISCONNECTED', 'ERROR') NOT NULL DEFAULT 'CONNECTED',
    `isTestnet` BOOLEAN NOT NULL DEFAULT true,
    `lastConnectedAt` DATETIME(3) NULL,
    `lastError` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ExchangeAccount_userId_idx`(`userId`),
    UNIQUE INDEX `ExchangeAccount_userId_exchange_isTestnet_key`(`userId`, `exchange`, `isTestnet`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ExchangeAccount` ADD CONSTRAINT `ExchangeAccount_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
