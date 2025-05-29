// File: client/src/dexie/db.js
// This file contains the Dexie.js database setup for the application.

import Dexie from "dexie";

export const db = new Dexie("PostDraftDB");

db.version(1).stores({
  drafts: "++id, userId, postType, sectionImages, comment, internalMemo, uniqueId, createdAt",
});
