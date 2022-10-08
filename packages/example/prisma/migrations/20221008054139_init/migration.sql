/*
  Warnings:

  - You are about to drop the `A2CMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "A2CMessage";

-- CreateTable
CREATE TABLE "crab2darwiniaLcmpMessage" (
    "id" SERIAL NOT NULL,
    "messageId" TEXT NOT NULL,
    "soureChain" TEXT NOT NULL DEFAULT '',
    "targetChain" TEXT NOT NULL DEFAULT '',
    "messageAcceptedHash" TEXT NOT NULL DEFAULT '',
    "messageDeliveredHash" TEXT NOT NULL DEFAULT '',
    "messageDispatchedHash" TEXT NOT NULL DEFAULT '',
    "acceptedTime" TEXT NOT NULL DEFAULT '',
    "deliveredTime" TEXT NOT NULL DEFAULT '',
    "dispatchedTime" TEXT NOT NULL DEFAULT '',
    "dispatchedResult" TEXT NOT NULL DEFAULT '',
    "deliveredResult" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "crab2darwiniaLcmpMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "crab2darwiniaLcmpMessage_messageId_key" ON "crab2darwiniaLcmpMessage"("messageId");
