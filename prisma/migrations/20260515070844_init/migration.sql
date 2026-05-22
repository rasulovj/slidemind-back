-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO', 'TEAM');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('uz', 'en', 'ru');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "fullName" TEXT,
    "avatarUrl" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "language" "Language" NOT NULL DEFAULT 'uz',
    "emailVerified" TIMESTAMP(3),
    "refreshToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Presentation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Sarlavsiz prezentatsiya',
    "thumbnailUrl" TEXT,
    "slideCount" INTEGER NOT NULL DEFAULT 0,
    "aspectRatio" TEXT NOT NULL DEFAULT '16:9',
    "themeId" TEXT NOT NULL DEFAULT 'default',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Presentation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slide" (
    "id" TEXT NOT NULL,
    "presentationId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "canvasJson" JSONB NOT NULL DEFAULT '{}',
    "background" JSONB NOT NULL DEFAULT '{"type":"color","value":"#ffffff"}',
    "speakerNotes" TEXT,
    "thumbnailUrl" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Slide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "previewUrl" TEXT NOT NULL,
    "slidesJson" JSONB NOT NULL,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailVerifyToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailVerifyToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Presentation_shareToken_key" ON "Presentation"("shareToken");

-- CreateIndex
CREATE INDEX "Presentation_userId_idx" ON "Presentation"("userId");

-- CreateIndex
CREATE INDEX "Presentation_shareToken_idx" ON "Presentation"("shareToken");

-- CreateIndex
CREATE INDEX "Slide_presentationId_idx" ON "Slide"("presentationId");

-- CreateIndex
CREATE INDEX "Slide_presentationId_position_idx" ON "Slide"("presentationId", "position");

-- CreateIndex
CREATE INDEX "Template_category_idx" ON "Template"("category");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerifyToken_tokenHash_key" ON "EmailVerifyToken"("tokenHash");

-- CreateIndex
CREATE INDEX "EmailVerifyToken_tokenHash_idx" ON "EmailVerifyToken"("tokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_tokenHash_idx" ON "PasswordResetToken"("tokenHash");

-- AddForeignKey
ALTER TABLE "Presentation" ADD CONSTRAINT "Presentation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slide" ADD CONSTRAINT "Slide_presentationId_fkey" FOREIGN KEY ("presentationId") REFERENCES "Presentation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
