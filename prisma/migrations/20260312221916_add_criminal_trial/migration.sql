-- CreateTable
CREATE TABLE "Trial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "criminalCaseId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "order" INTEGER NOT NULL,
    "checkItems" TEXT,
    "proceedings" TEXT,
    "submissions" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Trial_criminalCaseId_fkey" FOREIGN KEY ("criminalCaseId") REFERENCES "CriminalCase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TrialAttendance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "trialId" TEXT NOT NULL,
    "defendantId" TEXT NOT NULL,
    "isPresent" BOOLEAN NOT NULL DEFAULT true,
    "isSummonsServed" BOOLEAN,
    CONSTRAINT "TrialAttendance_trialId_fkey" FOREIGN KEY ("trialId") REFERENCES "Trial" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TrialAttendance_defendantId_fkey" FOREIGN KEY ("defendantId") REFERENCES "CriminalDefendant" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "TrialAttendance_trialId_defendantId_key" ON "TrialAttendance"("trialId", "defendantId");
