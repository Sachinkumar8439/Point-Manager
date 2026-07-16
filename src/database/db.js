import { openDB } from "idb";
import { DB_NAME, DB_VERSION, STORES } from "./dbConstants";

let dbInstance = null;

export async function getDB() {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      console.log("🚀 Creating Database...");

      // ============================================
      // MEMBERS
      // ============================================

      if (!db.objectStoreNames.contains(STORES.MEMBERS)) {
        const members = db.createObjectStore(STORES.MEMBERS, {
          keyPath: "id",
        });

        members.createIndex("category", "category");
        members.createIndex("gender", "gender");
        members.createIndex("isActive", "isActive");
      }

      if (!db.objectStoreNames.contains("reports")) {
        const reports = db.createObjectStore("reports", {
          keyPath: "id",
        });

        reports.createIndex("memberId", "memberId", { unique: false });
        reports.createIndex("yearMonth", "yearMonth", { unique: false });
        reports.createIndex("isClosed", "isClosed", { unique: false });
        reports.createIndex("isReviewed", "isReviewed", { unique: false });
        reports.createIndex("lastSyncedDate", "lastSyncedDate", {
          unique: false,
        });
        reports.createIndex("memberId_yearMonth", ["memberId", "yearMonth"], {
          unique: true,
        });
      }

      // ============================================
      // DAILY RECORDS
      // One Record Per Member Per Day
      // ============================================

      if (!db.objectStoreNames.contains(STORES.DAILY_RECORDS)) {
        const daily = db.createObjectStore(STORES.DAILY_RECORDS, {
          keyPath: "id",
        });

        daily.createIndex("memberId", "memberId");
        daily.createIndex("date", "date");
      }

      // ============================================
      // SETTINGS
      // ============================================

      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        db.createObjectStore(STORES.SETTINGS, {
          keyPath: "id",
        });
      }

      if (!db.objectStoreNames.contains("tasks")) {
        const taskStore = db.createObjectStore("tasks", {
          keyPath: "id",
        });

        // taskStore.createIndex("title", "title");
        taskStore.createIndex("createdAt", "createdAt");
        taskStore.createIndex("isActive", "isActive");
        taskStore.createIndex("updatedAt", "updatedAt");
      }

      // ============================================
      // APP INFO
      // ============================================

      if (!db.objectStoreNames.contains(STORES.APP_INFO)) {
        db.createObjectStore(STORES.APP_INFO, {
          keyPath: "id",
        });
      }

      if (!db.objectStoreNames.contains("taskGroups")) {
        const groupStore = db.createObjectStore("taskGroups", {
          keyPath: "id",
        });

        groupStore.createIndex("name", "name");
        groupStore.createIndex("createdAt", "createdAt");
        groupStore.createIndex("updatedAt", "updatedAt");
      }
    },
  });

  return dbInstance;
}
