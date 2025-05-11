// File: client/src/util/FileUtil.js
// Description: Utility functions to handle file operations

import { getUuid } from './RandomUtil';

export const getS3Filename = (uniqueId, images) => {
    return images.map((subArray, outerIndex) => {
        return subArray.map((image, innerIndex) => {
            const fileExtension = image.file.name.split('.').pop();
            image.s3Url = `${uniqueId}/${outerIndex}/${getUuid(12).randomUUID()}.${fileExtension}`
            return image;
        })
    })
}

