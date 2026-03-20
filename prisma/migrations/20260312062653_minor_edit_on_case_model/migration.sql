/*
  Warnings:

  - You are about to drop the column `crimeTitle` on the `CriminalCase` table. All the data in the column will be lost.
  - Added the required column `crimeTitle` to the `CriminalDefendant` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CriminalCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "prosecutors" TEXT NOT NULL,
    CONSTRAINT "CriminalCase_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CriminalCase" ("caseId", "id", "prosecutors") SELECT "caseId", "id", "prosecutors" FROM "CriminalCase";
DROP TABLE "CriminalCase";
ALTER TABLE "new_CriminalCase" RENAME TO "CriminalCase";
CREATE UNIQUE INDEX "CriminalCase_caseId_key" ON "CriminalCase"("caseId");
CREATE TABLE "new_CriminalDefendant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "criminalCaseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "address" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "crimeTitle" TEXT NOT NULL,
    "isDetained" BOOLEAN NOT NULL DEFAULT false,
    "detentionPlace" TEXT,
    "detentionDate" DATETIME,
    "arrestDate" DATETIME,
    "isMandatoryPublicDefense" BOOLEAN NOT NULL DEFAULT false,
    "mandatoryReason" TEXT,
    "publicDefender" TEXT,
    "privateDefender" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CriminalDefendant_criminalCaseId_fkey" FOREIGN KEY ("criminalCaseId") REFERENCES "CriminalCase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CriminalDefendant" ("address", "arrestDate", "birthDate", "createdAt", "criminalCaseId", "detentionDate", "detentionPlace", "id", "isDetained", "isMandatoryPublicDefense", "mandatoryReason", "name", "order", "privateDefender", "publicDefender") SELECT "address", "arrestDate", "birthDate", "createdAt", "criminalCaseId", "detentionDate", "detentionPlace", "id", "isDetained", "isMandatoryPublicDefense", "mandatoryReason", "name", "order", "privateDefender", "publicDefender" FROM "CriminalDefendant";
DROP TABLE "CriminalDefendant";
ALTER TABLE "new_CriminalDefendant" RENAME TO "CriminalDefendant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
