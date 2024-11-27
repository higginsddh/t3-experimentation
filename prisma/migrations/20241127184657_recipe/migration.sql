-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "link" TEXT,
    "photo" TEXT,
    "ingredients" JSONB NOT NULL,
    "tags" JSONB NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);
