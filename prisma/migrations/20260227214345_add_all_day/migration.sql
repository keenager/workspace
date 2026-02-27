/*
  Warnings:

  - Added the required column `allDay` to the `CalendarEvent` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CalendarEvent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "allDay" BOOLEAN NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_CalendarEvent" ("createdAt", "description", "endDate", "id", "priority", "startDate", "title", "updatedAt") SELECT "createdAt", "description", "endDate", "id", "priority", "startDate", "title", "updatedAt" FROM "CalendarEvent";
DROP TABLE "CalendarEvent";
ALTER TABLE "new_CalendarEvent" RENAME TO "CalendarEvent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
