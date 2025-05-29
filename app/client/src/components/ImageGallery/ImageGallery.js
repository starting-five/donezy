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
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
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

  // Swipe state
  const [startTouch, setStartTouch] = useState(0); // track the starting touch position

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

  const imagesToShow = images?.slice(currentIndex, currentIndex + 1);
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex + 1 < images?.length;

  useEffect(() => {
    if (images?.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= images.length) {
      setCurrentIndex(images.length - 1); // shift back to last valid image
    }
  }, [images, currentIndex]);

  // Handle Swipe
  const handleTouchStart = (e) => {
    setStartTouch(e.touches[0].clientX); // track the touch start position
  };

  const handleTouchMove = (e) => {
    // no action needed here, just tracking the movement
  };

  const handleTouchEnd = (e) => {
    const endTouch = e.changedTouches[0].clientX;
    const diff = startTouch - endTouch;

    // If swipe is significant, determine the direction
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext(); // swipe left -> next image
      } else {
        handlePrevious(); // swipe right -> previous image
      }
    }
  };

  return (
    <Box className="image-gallery-container">
      <Typography className="image-gallery-title" variant="h6">
        {title}
      </Typography>

      {/* Image List */}
      <Box
        className="image-gallery-image-list"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
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
        {images?.length > 1 && (
          <>
            {canGoLeft && (
              <IconButton
                className="image-gallery-arrow-btn left"
                onClick={handlePrevious}
                disabled={!canGoLeft}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            {canGoRight && (
              <IconButton
                className="image-gallery-arrow-btn right"
                onClick={handleNext}
                disabled={!canGoRight}
              >
                <ArrowForwardIcon />
              </IconButton>
            )}
          </>
        )}
      </Box>

      {images?.length > 0 && (
        <Typography align="center" variant="body2" sx={{ mt: 1 }}>
          {currentIndex + 1} / {images.length}
        </Typography>
      )}

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
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="lg"
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ position: "relative" }}>
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
            {images.length > 1 && selectedDialogIndex > 0 && (
              <IconButton
                onClick={handleDialogPrevious}
                className="image-dialog-gallery-arrow-btn left"
              >
                <ArrowBackIcon />
              </IconButton>
            )}

            {/* Right Arrow */}
            {images.length > 1 && selectedDialogIndex < images.length - 1 && (
              <IconButton
                onClick={handleDialogNext}
                className="image-dialog-gallery-arrow-btn right"
              >
                <ArrowForwardIcon />
              </IconButton>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ImageGallery;
