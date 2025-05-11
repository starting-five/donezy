// File: client/src/pages/DisplayPage/DisplayPage.js
// Description: This file contains the DisplayPage component, which fetches and displays a post's details and images from AWS S3.

import AWS from "aws-sdk";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_POST_BY_POST_ID } from "../../graphql/queries/postQueries";
import "./DisplayPage.css";

import { useQuery } from "@apollo/client";
import { Box } from "@mui/material";
import ImageGallery from "../../components/ImageGallery/ImageGallery";

const DisplayPage = () => {
  const { uniqueID } = useParams();

  const {
    loading: postLoading,
    error: postError,
    data: postData,
  } = useQuery(GET_POST_BY_POST_ID, {
    variables: { postId: uniqueID },
  });

  // Store images for each section
  const [sectionImages, setSectionImages] = useState({});

  useEffect(() => {
    if (!postData || !postData.getPostByPostId?.postType?.sections) return;

    const S3_BUCKET = process.env.REACT_APP_AWS_S3_BUCKET;
    const REGION = process.env.REACT_APP_AWS_REGION;

    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: REGION,
    });

    const s3 = new AWS.S3();

    // Fetch images for a single folder
    const fetchImagesFromFolder = async (folder) => {
      try {
        const params = {
          Bucket: S3_BUCKET,
          Prefix: `uploads/${uniqueID}/${folder}/`,
        };
        const data = await s3.listObjectsV2(params).promise();
        return data.Contents.map((item) => ({
          url: s3.getSignedUrl("getObject", {
            Bucket: S3_BUCKET,
            Key: item.Key,
            Expires: 3600,
          }),
        }));
      } catch (error) {
        console.error(`Error fetching images from ${folder}:`, error);
        return [];
      }
    };

    // Fetch images for all sections
    const fetchAllSectionImages = async () => {
      const sections = postData.getPostByPostId.postType.sections;
      const imagesBySection = {};

      await Promise.all(
        sections.map(async (section, idx) => {
          const images = await fetchImagesFromFolder(idx);
          imagesBySection[idx] = images;
        })
      );

      setSectionImages(imagesBySection);
    };

    fetchAllSectionImages();
    console.log("Fetched images for sections:", sectionImages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postData, uniqueID]);

  if (postLoading) return <div>Loading...</div>;
  if (postError) return <div>Error: {postError.message}</div>;
  if (!postData || !postData.getPostByPostId) return <div>No post found.</div>;

  const { postType, comments } = postData.getPostByPostId;

  return (
    <div className="display-page">
      {postType.sections.map((section, index) => (
        <ImageGallery
          key={section + index}
          title={section}
          sectionIndex={index}
          images={sectionImages[index] || []}
          showDeleteButton={false}
          showSelectButton={false}
        />
      ))}

      <Box className="display-comments-box">
        {comments}
      </Box>
    </div>
  );
};

export default DisplayPage;
