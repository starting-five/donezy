// File: client/src/util/RandomUtil.js
// Description: Utility functions to generate unique IDs

import ShortUniqueId from 'short-unique-id';

export const getUuid = (length) => {
    return new ShortUniqueId({ length });
}

export const generateUniqueId = (length) => {
    const uuid = new ShortUniqueId({ length });
    return uuid.randomUUID();
}
