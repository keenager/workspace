/*
  Warnings:

  - You are about to drop the column `crimeTitle` on the `Case` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Case" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseNumber" TEXT NOT NULL,
    "caseType" TEXT NOT NULL,
    "caseName" TEXT NOT NULL,
    "court" TEXT NOT NULL,
    "filedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Case" ("caseName", "caseNumber", "caseType", "court", "createdAt", "filedAt", "id", "updatedAt") SELECT "caseName", "caseNumber", "caseType", "court", "createdAt", "filedAt", "id", "updatedAt" FROM "Case";
DROP TABLE "Case";
ALTER TABLE "new_Case" RENAME TO "Case";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
