/*
  Warnings:

  - You are about to drop the column `teste` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "email" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photo" TEXT,
    "premium" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("email", "name", "password", "photo", "premium") SELECT "email", "name", "password", "photo", "premium" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
