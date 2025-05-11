// File: client/src/pages/AddContentPage/AddContentPage.js
// Description: This file contains the AddContentPage component, which allows users to add content to a post.

import {
  TextareaAutosize,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import "./AddContentPage.css";

const AddContentPage = ({
  postType,
  comment,
  handleImageChange,
  handleDeleteImage,
  handleTextInput,
  sectionImages,
}) => {
  const theme = useTheme();

  return (
    <div className="create-post-page">
      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ mb: 2, fontWeight: "regular", textAlign: "center" }}
      >
        {"Select your images and add a comment for the post."}
      </Typography>
      {postType.sections.map((item, index) => (
        <ImageGallery
          key={item + index}
          title={item}
          images={sectionImages[index] || []}
          onImageChange={handleImageChange}
          onImageDelete={handleDeleteImage}
          sectionIndex={index}
        ></ImageGallery>
      ))}
      <TextareaAutosize
        value={comment}
        onChange={handleTextInput}
        minRows={5}
        placeholder="Optional: Write your comment here..."
        className="add-content-textarea"
        style={{
          fontFamily: theme.typography.body1.fontFamily,
          fontSize: theme.typography.body1.fontSize,
        }}
      />
    </div>
  );
};

export default AddContentPage;
