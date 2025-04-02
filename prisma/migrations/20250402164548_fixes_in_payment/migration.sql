-- DropIndex
DROP INDEX "Payment_userId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "messageCount" SET DEFAULT 3;
