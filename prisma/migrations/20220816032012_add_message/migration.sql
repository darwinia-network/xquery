-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "srcTx" TEXT NOT NULL,
    "srcBlockNumber" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
