-- Add referralCode as nullable first, populate, then make unique
ALTER TABLE "User" ADD COLUMN "referralCode" TEXT;
ALTER TABLE "User" ADD COLUMN "referredBy" TEXT;

-- Populate existing rows with unique codes
UPDATE "User" SET "referralCode" = gen_random_uuid()::text WHERE "referralCode" IS NULL;

-- Now make it NOT NULL and add constraints
ALTER TABLE "User" ALTER COLUMN "referralCode" SET NOT NULL;
ALTER TABLE "User" ADD CONSTRAINT "User_referralCode_key" UNIQUE ("referralCode");

-- Add foreign key for referredBy
ALTER TABLE "User" ADD CONSTRAINT "User_referredBy_fkey"
  FOREIGN KEY ("referredBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Indexes
CREATE INDEX "User_referralCode_idx" ON "User"("referralCode");
