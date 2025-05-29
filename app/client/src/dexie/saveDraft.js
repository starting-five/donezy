// File: client/src/dexie/db.js
// This file containes saveDraft function to save post drafts in Dexie.js database.

import { db } from "./db";

export const saveDraft = async (userId, draftData) => {
  const now = new Date().toISOString();
  const draft = {
    ...draftData,
    userId,
    status: 'draft',
    createdAt: now
  };


  // Check if a draft exists with the same uniqueId and userId
  const existing = await db.drafts
    .where('uniqueId')
    .equals(draft.uniqueId)
    .first();

  if (existing) {
    await db.drafts.update(existing.id, draft);
  } else {
    await db.drafts.add(draft);
  }
};
