/*
  Warnings:

  - You are about to drop the `ShoppingListItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ShoppingListItem";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Shoppinglistitem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "item" TEXT NOT NULL
);
