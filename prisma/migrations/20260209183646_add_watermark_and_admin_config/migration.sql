-- AlterTable
ALTER TABLE "Pack" ADD COLUMN "watermarkOpacity" REAL;
ALTER TABLE "Pack" ADD COLUMN "watermarkText" TEXT;

-- CreateTable
CREATE TABLE "AdminConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
