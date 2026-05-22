/*
  Warnings:

  - A unique constraint covering the columns `[orderNum]` on the table `PaymentOrder` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PaymentOrder" ADD COLUMN     "orderNum" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentOrder_orderNum_key" ON "PaymentOrder"("orderNum");
