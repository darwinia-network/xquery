/*
  Warnings:

  - A unique constraint covering the columns `[authorId]` on the table `A2CMessage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `authorId` to the `A2CMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "A2CMessage" ADD COLUMN     "authorId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "A2CMessage_authorId_key" ON "A2CMessage"("authorId");
