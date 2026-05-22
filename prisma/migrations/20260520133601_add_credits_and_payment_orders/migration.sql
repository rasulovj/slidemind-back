-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('TOPUP', 'USAGE', 'BONUS', 'REFUND');

-- CreateEnum
CREATE TYPE "PaymentOrderType" AS ENUM ('CREDIT_PACK', 'PLAN_UPGRADE');

-- CreateEnum
CREATE TYPE "PaymentOrderStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 10;

-- CreateTable
CREATE TABLE "CreditTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "reference" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CreditTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentOrder" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PaymentOrderType" NOT NULL,
    "status" "PaymentOrderStatus" NOT NULL DEFAULT 'PENDING',
    "amountUzs" INTEGER NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "plan" "Plan",
    "chequeId" TEXT,
    "tspayTxId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CreditTransaction_userId_idx" ON "CreditTransaction"("userId");

-- CreateIndex
CREATE INDEX "CreditTransaction_userId_createdAt_idx" ON "CreditTransaction"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentOrder_chequeId_key" ON "PaymentOrder"("chequeId");

-- CreateIndex
CREATE INDEX "PaymentOrder_userId_idx" ON "PaymentOrder"("userId");

-- CreateIndex
CREATE INDEX "PaymentOrder_chequeId_idx" ON "PaymentOrder"("chequeId");

-- AddForeignKey
ALTER TABLE "CreditTransaction" ADD CONSTRAINT "CreditTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentOrder" ADD CONSTRAINT "PaymentOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
