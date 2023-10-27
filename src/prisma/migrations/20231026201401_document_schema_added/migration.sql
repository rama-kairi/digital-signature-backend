-- CreateTable
CREATE TABLE "documents" (
    "uuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "deletedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "name" TEXT,
    "data" TEXT,
    "userUuid" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("uuid")
);

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "users"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
