-- CreateTable
CREATE TABLE "LcmpMessage" (
    "messageId" TEXT NOT NULL,
    "sourceChain" TEXT NOT NULL,
    "targetChain" TEXT NOT NULL,
    "acceptedHash" TEXT NOT NULL DEFAULT '',
    "dispatchHash" TEXT NOT NULL DEFAULT '',
    "deliveredHash" TEXT NOT NULL DEFAULT '',
    "dispatchResult" TEXT NOT NULL DEFAULT '',
    "deliveredResult" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3),
    "acceptedTime" TIMESTAMP(3),
    "dipatchTime" TIMESTAMP(3),
    "deliveredTime" TIMESTAMP(3),

    CONSTRAINT "LcmpMessage_pkey" PRIMARY KEY ("messageId")
);
