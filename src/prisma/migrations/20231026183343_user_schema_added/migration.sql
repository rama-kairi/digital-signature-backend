/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "uuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
