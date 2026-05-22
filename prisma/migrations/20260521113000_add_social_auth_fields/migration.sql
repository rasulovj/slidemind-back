-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE', 'TELEGRAM');

-- AlterTable
ALTER TABLE "User"
ADD COLUMN "authProvider" "AuthProvider" NOT NULL DEFAULT 'LOCAL',
ADD COLUMN "googleId" TEXT,
ADD COLUMN "telegramId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");
