// File: client/src/dexie/loadDraft.js
// This file contains load functions to load post drafts from Dexie.js database.
import { db } from "./db";

/**
 * Load all drafts for a given user, sorted by most recent createdAt date.
 */
export const loadUserDrafts = async (userId) => {
  const drafts = await db.drafts
    .where('userId')
    .equals(userId)
    .toArray();

  drafts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return drafts;
};

/**
 * Load a single draft by its uniqueId.
 */
export const loadDraftByUniqueId = async (uniqueId) => {
  const draft = await db.drafts
    .where('uniqueId')
    .equals(uniqueId)
    .first();

  return draft;
};