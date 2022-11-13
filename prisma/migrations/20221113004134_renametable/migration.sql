/*
  Warnings:

  - You are about to drop the `Shoppinglistitem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Shoppinglistitem";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ShoppingListItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "item" TEXT NOT NULL
);
