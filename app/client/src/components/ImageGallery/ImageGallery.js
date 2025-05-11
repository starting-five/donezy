// File: client/src/components/ImageGallery/ImageGallery.js
// Description: This file contains the ImageGallery component which is used to display a gallery of images.

import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogContent, IconButton,
  Typography
} from "@mui/material";
import React, { useState } from "react";
import "./ImageGallery.css";

const ImageGallery = ({
  sectionIndex,
  images,
  onImageChange,
  onImageDelete,
  title,
  showDeleteButton = true,
  showSelectButton = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDialogIndex, setSelectedDialogIndex] = useState(null);

  const handleImageSelect = (event) => {
    onImageChange(sectionIndex, event);
  };

  const handleImageClick = (image) => {
    const index = images.indexOf(image);
    setSelectedImage(image);
    setSelectedDialogIndex(index);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDialogIndex(null);
  };

  const handleNext = () => {
    if (currentIndex + 1 < images.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDialogNext = () => {
    if (selectedDialogIndex < images.length - 1) {
      const newIndex = selectedDialogIndex + 1;
      setSelectedDialogIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  };

  const handleDialogPrevious = () => {
    if (selectedDialogIndex > 0) {
      const newIndex = selectedDialogIndex - 1;
      setSelectedDialogIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  };

  const imagesToShow = images?.slice(currentIndex, currentIndex + 3);
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex + 3 < images?.length;

  return (
    <Box className="image-gallery-container">
      <Typography className="image-gallery-title" variant="h6">
        {title}
      </Typography>

      {/* Image List */}
      <Box className="image-gallery-image-list">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {imagesToShow?.length > 0 ? (
            imagesToShow?.map((image, index) => (
              <Box
                key={index}
                className="image-gallery-image-box"
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image.url}
                  alt={`img-${index}`}
                  className="image-gallery-img"
                />
                {showDeleteButton && (
                  <IconButton
                    className="image-gallery-delete-btn"
                    onClick={(event) => {
                      event.stopPropagation();
                      onImageDelete(sectionIndex, image);
                    }}
                  >
                    <DeleteIcon sx={{ color: "white" }} />
                  </IconButton>
                )}
              </Box>
            ))
          ) : (
            <Typography color="textSecondary">No images uploaded</Typography>
          )}
        </Box>

        {/* Navigation Arrows */}
        {images?.length > 3 && (
          <>
            <IconButton
              className="image-gallery-arrow-btn left"
              onClick={handlePrevious}
              disabled={!canGoLeft}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              className="image-gallery-arrow-btn right"
              onClick={handleNext}
              disabled={!canGoRight}
            >
              <ArrowForwardIcon />
            </IconButton>
          </>
        )}
      </Box>

      {/* Upload Button */}
      {showSelectButton && (
        <Box sx={{ mt: 2, width: "100%" }}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            style={{ display: "none" }}
            id={`image-upload-input-${sectionIndex}`}
          />
          <label htmlFor={`image-upload-input-${sectionIndex}`}>
            <Button variant="contained" component="span" fullWidth>
              Select Images
            </Button>
          </label>
        </Box>
      )}

      {/* Dialog to preview image */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="lg">
        <DialogContent sx={{ position: "relative", p: 0 }}>
          <img
            src={selectedImage?.url}
            alt="Selected"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              display: "block",
            }}
          />

          {/* Left Arrow */}
          <IconButton
            onClick={handleDialogPrevious}
            disabled={selectedDialogIndex === 0}
            className="image-gallery-arrow-btn left"
          >
            <ArrowBackIcon />
          </IconButton>

          {/* Right Arrow */}
          <IconButton
            onClick={handleDialogNext}
            disabled={selectedDialogIndex === images?.length - 1}
            className="image-gallery-arrow-btn right"
          >
            <ArrowForwardIcon />
          </IconButton>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ImageGallery;
