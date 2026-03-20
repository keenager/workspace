/*
  Warnings:

  - You are about to drop the `HandlingAttorney` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LawFirm` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrivateDefender` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prosecutor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PublicDefender` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `caseId` on the `CompensationApplicant` table. All the data in the column will be lost.
  - You are about to drop the column `caseId` on the `CriminalDefendant` table. All the data in the column will be lost.
  - Added the required column `criminalCaseId` to the `CompensationApplicant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `criminalCaseId` to the `CriminalDefendant` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `CriminalDefendant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birthDate` on table `CriminalDefendant` required. This step will fail if there are existing NULL values in that column.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "HandlingAttorney";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LawFirm";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PrivateDefender";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Prosecutor";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PublicDefender";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "CriminalCase" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "crimeTitle" TEXT NOT NULL,
    "prosecutors" TEXT NOT NULL,
    CONSTRAINT "CriminalCase_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CompensationApplicant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "criminalCaseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "address" TEXT NOT NULL,
    "claimAmount" INTEGER NOT NULL,
    "claimReason" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CompensationApplicant_criminalCaseId_fkey" FOREIGN KEY ("criminalCaseId") REFERENCES "CriminalCase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CompensationApplicant" ("address", "birthDate", "claimAmount", "claimReason", "createdAt", "id", "name", "order") SELECT "address", "birthDate", "claimAmount", "claimReason", "createdAt", "id", "name", "order" FROM "CompensationApplicant";
DROP TABLE "CompensationApplicant";
ALTER TABLE "new_CompensationApplicant" RENAME TO "CompensationApplicant";
CREATE TABLE "new_CriminalDefendant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "criminalCaseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "address" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
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
INSERT INTO "new_CriminalDefendant" ("address", "arrestDate", "birthDate", "createdAt", "detentionDate", "detentionPlace", "id", "isDetained", "isMandatoryPublicDefense", "mandatoryReason", "name", "order") SELECT "address", "arrestDate", "birthDate", "createdAt", "detentionDate", "detentionPlace", "id", "isDetained", "isMandatoryPublicDefense", "mandatoryReason", "name", "order" FROM "CriminalDefendant";
DROP TABLE "CriminalDefendant";
ALTER TABLE "new_CriminalDefendant" RENAME TO "CriminalDefendant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "CriminalCase_caseId_key" ON "CriminalCase"("caseId");
