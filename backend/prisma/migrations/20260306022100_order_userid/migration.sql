/*
  Warnings:

  - You are about to drop the column `userEmail` on the `Order` table. All the data in the column will be lost.
  - Made the column `userId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "userEmail",
ALTER COLUMN "userId" SET NOT NULL;
