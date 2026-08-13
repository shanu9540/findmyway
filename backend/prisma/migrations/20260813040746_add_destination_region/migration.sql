-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Destination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL,
    "continent" TEXT NOT NULL DEFAULT '',
    "region" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "gallery" TEXT NOT NULL DEFAULT '',
    "bestTimeToVisit" TEXT NOT NULL DEFAULT '',
    "averageDuration" TEXT NOT NULL DEFAULT '',
    "estimatedBudget" REAL NOT NULL DEFAULT 0.0,
    "rating" REAL NOT NULL DEFAULT 0.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "popularAttractions" TEXT NOT NULL DEFAULT '',
    "thingsToDo" TEXT NOT NULL DEFAULT '',
    "travelTips" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Destination" ("averageDuration", "bestTimeToVisit", "city", "continent", "country", "createdAt", "description", "estimatedBudget", "gallery", "id", "image", "name", "popularAttractions", "rating", "reviewCount", "thingsToDo", "travelTips", "updatedAt") SELECT "averageDuration", "bestTimeToVisit", "city", "continent", "country", "createdAt", "description", "estimatedBudget", "gallery", "id", "image", "name", "popularAttractions", "rating", "reviewCount", "thingsToDo", "travelTips", "updatedAt" FROM "Destination";
DROP TABLE "Destination";
ALTER TABLE "new_Destination" RENAME TO "Destination";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
