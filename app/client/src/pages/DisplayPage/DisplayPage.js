// File: client/src/pages/DisplayPage/DisplayPage.js
// Description: This file contains the DisplayPage component, which fetches and displays a post's details and images from AWS S3.

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GET_POST_BY_POST_ID } from "../../graphql/queries/postQueries";
import "./DisplayPage.css";

import { useQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import ImageGallery from "../../components/ImageGallery/ImageGallery";

const DisplayPage = () => {
  const { uniqueID } = useParams();
  const navigate = useNavigate();

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

    const fetchImagesFromSection = async (section) => {
      const res = await fetch(
        `${process.env.REACT_APP_API_SERVER_URL}/api/s3/list-images?postId=${uniqueID}&section=${section}`
      );
      const data = await res.json();
      return data.images || [];
    };

    const fetchAllSectionImages = async () => {
      const sections = postData.getPostByPostId.postType.sections;
      const imagesBySection = {};

      await Promise.all(
        sections.map(async (section, idx) => {
          const images = await fetchImagesFromSection(idx);
          imagesBySection[idx] = images;
        })
      );

      setSectionImages(imagesBySection);
    };

    fetchAllSectionImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postData, uniqueID]);

  useEffect(() => {
    if (!postLoading && postData && !postData.getPostByPostId) {
      navigate("/");
    }
  }, [postLoading, postData, navigate]);

  if (postLoading) return <div>Loading...</div>;
  if (postError) return <div>Error: {postError.message}</div>;
  if (!postData || !postData.getPostByPostId) return <div>No post found.</div>;

  const { postType, comments } = postData.getPostByPostId;

  return (
    <div className="display-page">
      {
        postData.getPostByPostId.user.company?.trim() !== "" && (
          <Box
            className="user-info-box"
            sx={{
              mb: 4,
              maxWidth: 600,
              mx: "auto",
              p: 1,
              backgroundColor: "background.paper",
              borderRadius: 1
            }}
          >
            <Typography variant="h5" color="text.primary">
              {postData.getPostByPostId.user.company}
            </Typography>
          </Box>
        )
      }
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

      {comments && comments.length > 0 && (
        <Box
          className="display-comments-box"
          sx={{
            mt: 4,
            maxWidth: 600,
            mx: "auto",
            p: 2,
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: 1,
            borderLeft: "4px solid",
            borderColor: "primary.main",
          }}
        >
          <Typography variant="body1" color="text.primary">
            {comments}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default DisplayPage;
