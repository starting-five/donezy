// File: client/src/dexie/db.js
// This file contains deleteDraft function to delete post drafts from Dexie.js database.

import { db } from "./db";

export const deleteDraft = async (uniqueId) => {
  // Find the draft by uniqueId
  const draft = await db.drafts
    .where('uniqueId')
    .equals(uniqueId)
    .first();

  // If the draft exists, delete it
  if (draft) {
    await db.drafts.delete(draft.id);
    return true; // Indicate successful deletion
  }

  return false; // Indicate that no draft was found to delete
}