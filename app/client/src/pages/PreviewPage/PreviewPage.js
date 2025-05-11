// File: client/src/pages/PreviewPage/PreviewPage.js
// Description: This file contains the PreviewPage component, which is responsible for displaying a preview of the post before submission.

import React from "react";
import {
  Box,
  Typography,
  Paper
} from "@mui/material";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import "./PreviewPage.css";

const PreviewPage = ({ postType, sectionImages, comment }) => {

  return (
    <div className="preview-page">
      <Box sx={{ maxWidth: 600, mx: "auto", my: 3, px: 2 }}>
        <Paper
          sx={{
            padding: 2,
            backgroundColor: "#e3f2fd",
            borderRadius: 2,
            boxShadow: 3,
            borderLeft: "6px solid #1976d2",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Almost Done!
          </Typography>
          <Typography variant="body1" paragraph>
            Take a moment to preview your images and comment.
          </Typography>
          <Typography variant="body1" paragraph>
            Once you click <strong>Finish</strong>, your post will be final and cannot be edited.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            If you'd like to make any edits, go back to the previous step.
          </Typography>
        </Paper>
      </Box>
      {postType.sections.map((item, index) => (
        <ImageGallery
          key={item + index}
          title={item}
          images={sectionImages[index] || []}
          sectionIndex={index}
          showDeleteButton={false}
          showSelectButton={false}
        />
      ))}
      {comment && (
        <Box className="preview-comment-box">
          {comment}
        </Box>
      )}
    </div>
  );
};

export default PreviewPage;
