-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `role` ENUM('VETERINARIAN', 'PET_OWNER') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clinics` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `city` VARCHAR(191) NOT NULL,
    `specialties` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `vetId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `clinics_vetId_key`(`vetId`),
    INDEX `clinics_vetId_idx`(`vetId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availability_schedules` (
    `id` VARCHAR(191) NOT NULL,
    `clinicId` VARCHAR(191) NOT NULL,
    `mondayStart` VARCHAR(191) NULL,
    `mondayEnd` VARCHAR(191) NULL,
    `tuesdayStart` VARCHAR(191) NULL,
    `tuesdayEnd` VARCHAR(191) NULL,
    `wednesdayStart` VARCHAR(191) NULL,
    `wednesdayEnd` VARCHAR(191) NULL,
    `thursdayStart` VARCHAR(191) NULL,
    `thursdayEnd` VARCHAR(191) NULL,
    `fridayStart` VARCHAR(191) NULL,
    `fridayEnd` VARCHAR(191) NULL,
    `saturdayStart` VARCHAR(191) NULL,
    `saturdayEnd` VARCHAR(191) NULL,
    `sundayStart` VARCHAR(191) NULL,
    `sundayEnd` VARCHAR(191) NULL,
    `slotDurationMinutes` INTEGER NOT NULL DEFAULT 30,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `availability_schedules_clinicId_key`(`clinicId`),
    INDEX `availability_schedules_clinicId_idx`(`clinicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availability_slots` (
    `id` VARCHAR(191) NOT NULL,
    `scheduleId` VARCHAR(191) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `isBooked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `availability_slots_scheduleId_idx`(`scheduleId`),
    INDEX `availability_slots_isBooked_idx`(`isBooked`),
    UNIQUE INDEX `availability_slots_scheduleId_startTime_key`(`scheduleId`, `startTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appointments` (
    `id` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `clinicId` VARCHAR(191) NOT NULL,
    `slotId` VARCHAR(191) NOT NULL,
    `petId` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `status` ENUM('CONFIRMED', 'CANCELLED') NOT NULL DEFAULT 'CONFIRMED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `appointments_slotId_key`(`slotId`),
    INDEX `appointments_ownerId_idx`(`ownerId`),
    INDEX `appointments_clinicId_idx`(`clinicId`),
    INDEX `appointments_slotId_idx`(`slotId`),
    INDEX `appointments_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pets` (
    `id` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `species` ENUM('PERRO', 'GATO', 'OTRO') NOT NULL,
    `size` ENUM('PEQUENO', 'MEDIANO', 'GRANDE') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `pets_ownerId_idx`(`ownerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `feedbacks` (
    `id` VARCHAR(191) NOT NULL,
    `appointmentId` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `feedback` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `feedbacks_appointmentId_key`(`appointmentId`),
    INDEX `feedbacks_appointmentId_idx`(`appointmentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `clinics` ADD CONSTRAINT `clinics_vetId_fkey` FOREIGN KEY (`vetId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `availability_schedules` ADD CONSTRAINT `availability_schedules_clinicId_fkey` FOREIGN KEY (`clinicId`) REFERENCES `clinics`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `availability_slots` ADD CONSTRAINT `availability_slots_scheduleId_fkey` FOREIGN KEY (`scheduleId`) REFERENCES `availability_schedules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_clinicId_fkey` FOREIGN KEY (`clinicId`) REFERENCES `clinics`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_slotId_fkey` FOREIGN KEY (`slotId`) REFERENCES `availability_slots`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `appointments` ADD CONSTRAINT `appointments_petId_fkey` FOREIGN KEY (`petId`) REFERENCES `pets`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pets` ADD CONSTRAINT `pets_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `feedbacks` ADD CONSTRAINT `feedbacks_appointmentId_fkey` FOREIGN KEY (`appointmentId`) REFERENCES `appointments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

