/*
  Warnings:

  - You are about to drop the column `travelersCount` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Destination` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Destination` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Destination` table. All the data in the column will be lost.
  - You are about to drop the column `durationDays` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `itineraryJson` on the `Package` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Package` table. All the data in the column will be lost.
  - Added the required column `description` to the `Package` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "travelDate" DATETIME NOT NULL,
    "adultsCount" INTEGER NOT NULL DEFAULT 1,
    "childrenCount" INTEGER NOT NULL DEFAULT 0,
    "roomsCount" INTEGER NOT NULL DEFAULT 1,
    "specialRequests" TEXT,
    "subtotal" REAL NOT NULL DEFAULT 0.0,
    "taxes" REAL NOT NULL DEFAULT 0.0,
    "discount" REAL NOT NULL DEFAULT 0.0,
    "totalPrice" REAL NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'Confirmed',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Booking_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "Package" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("createdAt", "id", "packageId", "status", "totalPrice", "travelDate", "updatedAt", "userId") SELECT "createdAt", "id", "packageId", "status", "totalPrice", "travelDate", "updatedAt", "userId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE TABLE "new_Destination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL,
    "continent" TEXT NOT NULL DEFAULT '',
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
INSERT INTO "new_Destination" ("country", "createdAt", "description", "id", "name", "rating", "updatedAt") SELECT "country", "createdAt", "description", "id", "name", "rating", "updatedAt" FROM "Destination";
DROP TABLE "Destination";
ALTER TABLE "new_Destination" RENAME TO "Destination";
CREATE TABLE "new_Package" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destinationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "gallery" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 1,
    "nights" INTEGER NOT NULL DEFAULT 0,
    "pricePerAdult" REAL NOT NULL DEFAULT 0.0,
    "pricePerChild" REAL NOT NULL DEFAULT 0.0,
    "originalPrice" REAL NOT NULL DEFAULT 0.0,
    "discount" REAL NOT NULL DEFAULT 0.0,
    "rating" REAL NOT NULL DEFAULT 0.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL DEFAULT '',
    "availableDates" TEXT NOT NULL DEFAULT '',
    "hotel" TEXT NOT NULL DEFAULT '',
    "meals" TEXT NOT NULL DEFAULT '',
    "transportation" TEXT NOT NULL DEFAULT '',
    "activities" TEXT NOT NULL DEFAULT '',
    "itinerary" TEXT NOT NULL DEFAULT '',
    "inclusions" TEXT NOT NULL DEFAULT '',
    "exclusions" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Package_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Package" ("createdAt", "destinationId", "id", "inclusions", "title", "updatedAt") SELECT "createdAt", "destinationId", "id", "inclusions", "title", "updatedAt" FROM "Package";
DROP TABLE "Package";
ALTER TABLE "new_Package" RENAME TO "Package";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
