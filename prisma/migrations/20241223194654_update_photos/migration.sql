/*
  Warnings:

  - You are about to drop the column `photo` on the `Recipe` table. All the data in the column will be lost.
  - Added the required column `photos` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "photo",
ADD COLUMN     "photos" JSONB NOT NULL;
