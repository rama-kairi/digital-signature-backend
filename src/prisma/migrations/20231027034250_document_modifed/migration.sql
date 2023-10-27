/*
  Warnings:

  - You are about to drop the column `signedPdf` on the `documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "documents" DROP COLUMN "signedPdf",
ADD COLUMN     "signature" TEXT;
