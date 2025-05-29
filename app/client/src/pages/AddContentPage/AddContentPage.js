// File: client/src/pages/AddContentPage/AddContentPage.js
// Description: This file contains the AddContentPage component, which allows users to add content to a post.

import { Button, Divider, TextareaAutosize, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import ImageGallery from "../../components/ImageGallery/ImageGallery";
import "./AddContentPage.css";
import SaveIcon from "@mui/icons-material/Save";

const AddContentPage = ({
  postType,
  comment,
  internalMemo,
  handleImageChange,
  handleDeleteImage,
  handleCommentInput,
  handleInternalMemoInput,
  handleSaveDraft,
  sectionImages,
}) => {
  const theme = useTheme();

  return (
    <div className="create-post-page">
      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{ mb: 2, fontWeight: "regular", textAlign: "center", margin: 2 }}
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
        id="comment-textarea"
        aria-label="comment"
        value={comment}
        onChange={handleCommentInput}
        minRows={5}
        placeholder="Optional: Write your comment here..."
        className="add-content-textarea"
        style={{
          fontFamily: theme.typography.body1.fontFamily,
          fontSize: theme.typography.body1.fontSize,
        }}
      />
      <Divider
        sx={{
          marginTop: 2,
          marginBottom: 2,
          backgroundColor: theme.palette.divider,
        }}
      />
      <Typography
        variant="subtitle1"
        color="text.secondary"
        sx={{
          mb: 2,
          fontWeight: "regular",
          textAlign: "center",
          color: theme.palette.warning.main,
        }}
      >
        {"For internal use only."}
      </Typography>
      <TextareaAutosize
        id="memo-textarea"
        aria-label="internal-memo"
        value={internalMemo}
        onChange={handleInternalMemoInput}
        minRows={5}
        placeholder="Optional: Write your internal memo here. This will not be shared with the customer."
        className="add-content-textarea"
        style={{
          fontFamily: theme.typography.body1.fontFamily,
          fontSize: theme.typography.body1.fontSize,
        }}
      />
      <Button
        id="save-draft-button"
        className="save-draft-button"
        fullWidth
        variant="text"
        startIcon={<SaveIcon />}
        sx={{ color: "#558b2f", marginTop: 2, marginBottom: 2 }}
        onClick={handleSaveDraft}
      >
        Save as Draft
      </Button>
    </div>
  );
};

export default AddContentPage;
