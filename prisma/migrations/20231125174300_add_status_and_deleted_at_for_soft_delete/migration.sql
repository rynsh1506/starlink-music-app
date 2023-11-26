/*
  Warnings:

  - Added the required column `Status` to the `Artist` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ArtistsStatusEnum" AS ENUM ('DELETED', 'LISTED');

-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "DeletedAt" TIMESTAMPTZ,
ADD COLUMN     "Status" "ArtistsStatusEnum" NOT NULL;
