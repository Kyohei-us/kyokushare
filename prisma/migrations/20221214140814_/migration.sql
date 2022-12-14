/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `UserAuth` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `UserAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserAuth" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth_email_key" ON "UserAuth"("email");
