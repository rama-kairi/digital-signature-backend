-- CreateTable
CREATE TABLE "User" (
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

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
