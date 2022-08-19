/*
  Warnings:

  - Made the column `acceptedTime` on table `LcmpMessage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dipatchTime` on table `LcmpMessage` required. This step will fail if there are existing NULL values in that column.
  - Made the column `deliveredTime` on table `LcmpMessage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "LcmpMessage" ALTER COLUMN "acceptedTime" SET NOT NULL,
ALTER COLUMN "acceptedTime" SET DEFAULT '',
ALTER COLUMN "acceptedTime" SET DATA TYPE TEXT,
ALTER COLUMN "dipatchTime" SET NOT NULL,
ALTER COLUMN "dipatchTime" SET DEFAULT '',
ALTER COLUMN "dipatchTime" SET DATA TYPE TEXT,
ALTER COLUMN "deliveredTime" SET NOT NULL,
ALTER COLUMN "deliveredTime" SET DEFAULT '',
ALTER COLUMN "deliveredTime" SET DATA TYPE TEXT;
