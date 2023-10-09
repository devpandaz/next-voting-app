/*
  Warnings:

  - You are about to drop the column `datePublished` on the `Question` table. All the data in the column will be lost.
  - Added the required column `timePublished` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "datePublished",
ADD COLUMN     "timePublished" TIMESTAMP(3) NOT NULL;
