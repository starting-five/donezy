// File: client/src/pages/CreatePage/CreatePage.js
// Description: This file contains the CreatePage component, which allows users to create a post by selecting a post type, adding content, and previewing the post before uploading it to S3. It uses Apollo Client for GraphQL queries and mutations, Material-UI for UI components, and Redux for state management.

import { useMutation } from "@apollo/client";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Link,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FileUploader from "../../components/FileUploader/FileUploader";
import { CREATE_POST } from "../../graphql/mutations/postMutation";
import { getUserId } from "../../redux/selectors/settingsSelectors";
import { getS3Filename } from "../../util/FileUtil";
import { generateUniqueId } from "../../util/RandomUtil";
import AddContentPage from "../AddContentPage/AddContentPage";
import PreviewPage from "../PreviewPage/PreviewPage";
import SelectPostTypePage from "../SelectPostTypePage/SelectPostTypePage";
import "./CreatePage.css";

const CreatePage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [postType, setPostType] = useState(null);
  const [sectionImages, setSectionImages] = useState([]);
  const [comment, setComment] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [createPost] = useMutation(CREATE_POST);
  const loggedInUserId = useSelector(getUserId);
  const [uniqueId, setUniqueId] = useState(generateUniqueId(12));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const steps = ["Select post type", "Add content", " Preview"];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setActiveStep(activeStep + 1);
    setIsFinished(true);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setPostType(null);
    setSectionImages([]);
    setUniqueId(generateUniqueId(12));
    setComment("");
    setIsFinished(false);
    setOpenSnackbar(false);
  };

  const handlePostTypeChange = (postType) => {
    setPostType(postType);
  };

  const handleImageChange = (sectionIndex, event) => {
    const files = Array.from(event.target.files).map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setSectionImages((prev) => {
      const updated = [...prev];
      updated[sectionIndex] = (updated[sectionIndex] || []).concat(files);
      return updated;
    });
  };

  const handleDeleteImage = (sectionIndex, imageToDelete) => {
    setSectionImages((prev) => {
      const updated = [...prev];
      updated[sectionIndex] = (updated[sectionIndex] || []).filter(
        (image) => image !== imageToDelete
      );
      return updated;
    });
  };

  const handleTextInput = (event) => {
    setComment(event.target.value);
  };

  const handleUploadComplete = (allUploaded) => {
    if (allUploaded) {
      console.log("✅ All files uploaded successfully");
      setSnackbarMessage(
        <>
          <Typography variant="body2">
            All files uploaded successfully!
          </Typography>
          <Typography variant="body2">
            The link to your post is:{" "}
            <Link
              href={`http://localhost:3000/post/${uniqueId}`}
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
            >
              {`localhost:3000/post/${uniqueId}`}
            </Link>
          </Typography>
        </>
      );
      setSnackbarSeverity("success");
      createPost({
        variables: {
          userId: loggedInUserId,
          postId: uniqueId,
          postTypeId: postType.id,
          comments: comment,
        },
        onError: (error) => {
          console.error("Error creating post", error);
        },
        onCompleted: (response) => {
          console.log("Post completed successfully:", response);
        },
        onSuccess: (response) => {
          console.log("Post created successfully:", response.data.createPost);
        },
      });
    } else {
      console.log("❌ Some files failed");
      setSnackbarMessage("Some files failed to upload.");
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false); // Close the snackbar when the user clicks the close button
  };

  useEffect(() => {
    if (postType) {
      const initialSectionImages = postType.sections.map(() => []);
      setSectionImages(initialSectionImages);
      setComment("");
    }
  }, [postType]);

  return (
    <div className="create-page">
      <Stepper id="createPageStepper" activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box id="create-page-content" sx={{ padding: 2 }}>
        {activeStep === 0 && (
          <SelectPostTypePage
            postType={postType}
            handleRadioChange={handlePostTypeChange}
          ></SelectPostTypePage>
        )}
        {activeStep === 1 && (
          <AddContentPage
            postType={postType}
            comment={comment}
            handleImageChange={handleImageChange}
            handleDeleteImage={handleDeleteImage}
            handleTextInput={handleTextInput}
            sectionImages={sectionImages}
          ></AddContentPage>
        )}
        {activeStep === 2 && !isFinished && (
          <PreviewPage
            postType={postType}
            sectionImages={sectionImages}
            comment={comment}
          ></PreviewPage>
        )}
        {isFinished && (
          <FileUploader
            files={getS3Filename(uniqueId, sectionImages).flat()}
            onUploadComplete={handleUploadComplete}
          />
        )}
      </Box>

      <Box
        id="create-page-nav"
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}
      >
        <Button
          id="create-page-nav-back-btn"
          disabled={activeStep === 0 || isFinished}
          onClick={handleBack}
          variant="outlined"
        >
          Back
        </Button>
        {activeStep === steps.length ? (
          <Button
            id="create-page-nav-reset-btn"
            variant="contained"
            color="primary"
            onClick={handleReset}
          >
            Reset
          </Button>
        ) : (
          <Button
            id="create-page-nav-next-btn"
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && !postType) ||
              (activeStep === 1 &&
                sectionImages.some((images) => images.length === 0)) ||
              isFinished
            }
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        )}
      </Box>
      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        anchorOrigin={{
          vertical: "top", // Position the Snackbar at the top
          horizontal: "center", // Position it in the center horizontally
        }}
      >
        <Alert
          severity={snackbarSeverity}
          sx={{
            position: "relative",
            width: "100%",
            paddingRight: "48px", // room for close button
            display: "flex",
            alignItems: "center", // center icon vertically with content
          }}
        >
          {/* Content in a box to not interfere with flex alignment */}
          <Box>{snackbarMessage}</Box>

          {/* Top-right close button */}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackbar}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Alert>
      </Snackbar>
    </div>
  );
};
export default CreatePage;
