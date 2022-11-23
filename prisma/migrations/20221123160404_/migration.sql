/*
  Warnings:

  - Added the required column `userId` to the `Kyoku` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Kyoku" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Kyoku" ADD CONSTRAINT "Kyoku_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
