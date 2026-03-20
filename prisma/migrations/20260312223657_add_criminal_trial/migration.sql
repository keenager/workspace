-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CaseSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "caseId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL,
    "sectionType" TEXT NOT NULL DEFAULT 'EDITOR',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CaseSection_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CaseSection" ("caseId", "content", "createdAt", "id", "order", "title", "updatedAt") SELECT "caseId", "content", "createdAt", "id", "order", "title", "updatedAt" FROM "CaseSection";
DROP TABLE "CaseSection";
ALTER TABLE "new_CaseSection" RENAME TO "CaseSection";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
