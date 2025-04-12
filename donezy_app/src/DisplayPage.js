import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FileDisplaySection from './FileDisplaySection';
import AWS from 'aws-sdk';

const DisplayPage = () => {
    const { uniqueID } = useParams(); // Get the unique ID from the URL
    const [beforeImages, setBeforeImages] = useState([]); // State to store "before" image URLs
    const [afterImages, setAfterImages] = useState([]); // State to store "after" image URLs
    const S3_BUCKET = 'donezy'; // Replace with your S3 bucket name
    const REGION = 'us-west-1'; // Replace with your S3 bucket region

    useEffect(() => {
        // Configure AWS SDK
        AWS.config.update({
            accessKeyId: 'AKIARXR7OELODM56VL7V', // Replace with your access key
            secretAccessKey: 'iq0jsSVjwkgwviokDOS4Igb3OdZ7ZSJazVw+G3Cm', // Replace with your secret key
            region: REGION,
        });

        const s3 = new AWS.S3();

        // Fetch images from a specific folder
        const fetchImagesFromFolder = async (folder) => {
            try {
                const params = {
                    Bucket: S3_BUCKET,
                    Prefix: `${uniqueID}/${folder}/`, // Path to the folder
                };

                const data = await s3.listObjectsV2(params).promise();

                // Extract image URLs
                return data.Contents.map((item) =>
                    s3.getSignedUrl('getObject', {
                        Bucket: S3_BUCKET,
                        Key: item.Key,
                        Expires: 3600, // URL expiration time in seconds
                    })
                );
            } catch (error) {
                console.error(`Error fetching images from ${folder}:`, error);
                return [];
            }
        };

        const fetchAllImages = async () => {
            const beforeImages = await fetchImagesFromFolder('before');
            const afterImages = await fetchImagesFromFolder('after');

            setBeforeImages(beforeImages); // Update state with "before" images
            setAfterImages(afterImages); // Update state with "after" images
        };

        fetchAllImages();
    }, [uniqueID]);

    return (
        <div>
            {/* Pass the title and images as props */}
            <FileDisplaySection images={beforeImages} title="Before Pictures" />
            <FileDisplaySection images={afterImages} title="After Pictures" />
        </div>
    );
};

export default DisplayPage;