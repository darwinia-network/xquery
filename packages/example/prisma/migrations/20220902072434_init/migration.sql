-- CreateTable
CREATE TABLE "A2CMessage" (
    "messageId" TEXT NOT NULL,
    "soureChain" TEXT NOT NULL DEFAULT '',
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredTime" TEXT NOT NULL DEFAULT '',
    "acceptedHash" TEXT NOT NULL DEFAULT '',
    "dispatchHash" TEXT NOT NULL DEFAULT '',
    "deliveredHash" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "A2CMessage_pkey" PRIMARY KEY ("messageId")
);
