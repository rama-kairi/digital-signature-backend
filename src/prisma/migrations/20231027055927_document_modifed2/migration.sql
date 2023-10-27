/*
  Warnings:

  - You are about to drop the column `data` on the `documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "documents" DROP COLUMN "data",
ADD COLUMN     "doc" TEXT,
ADD COLUMN     "signedDoc" TEXT;
