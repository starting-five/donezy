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
import { useEffect, useState, useRef } from "react";
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
import { saveDraft } from "../../dexie/saveDraft";
import { deleteDraft } from "../../dexie/deleteDraft";
import { useLocation } from "react-router-dom";

const CreatePage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [postType, setPostType] = useState(null);
  const [sectionImages, setSectionImages] = useState([]);
  const [comment, setComment] = useState("");
  const [internalMemo, setInternalMemo] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [createPost] = useMutation(CREATE_POST);
  const loggedInUserId = useSelector(getUserId);
  const [uniqueId, setUniqueId] = useState(generateUniqueId(12));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [duration, setDuration] = useState(null);
  const draftInitializedRef = useRef(false);

  const steps = ["Select post type", "Add content", " Preview"];

  const location = useLocation();
  const draft = location.state?.draft || null; // Get draft from location state if available

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

  const handleSaveDraft = async () => {
    try {
      await saveDraft(loggedInUserId, {
        postType,
        sectionImages,
        comment,
        internalMemo,
        uniqueId,
      });
      handleReset();
      setDuration(6000); // Set auto-hide duration for the snackbar
      setSnackbarMessage("Draft saved successfully!");
      setSnackbarSeverity("info");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error saving draft:", error);
      setSnackbarMessage("Failed to save draft.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setPostType(null);
    setSectionImages([]);
    setUniqueId(generateUniqueId(12));
    setComment("");
    setInternalMemo("");
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

  const handleCommentInput = (event) => {
    setComment(event.target.value);
  };

  const handleInternalMemoInput = (event) => {
    setInternalMemo(event.target.value);
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
              href={`${process.env.REACT_APP_CLIENT_URL}/post/${uniqueId}`}
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
            >
              {`${process.env.REACT_APP_CLIENT_URL}/post/${uniqueId}`}
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
          internalMemo: internalMemo,
        },
        onError: (error) => {
          console.error("Error creating post", error);
        },
        onCompleted: (response) => {
          // console.log("Post completed successfully:", response);
          if (draft) {
            // console.log("Deleting draft:", draft.uniqueId);
            deleteDraft(draft.uniqueId)
              .then(() => {
                // console.log("Draft deleted successfully");
              })
              .catch((error) => {
                console.error("Error deleting draft:", error);
              });

            sectionImages.forEach((section) => {
              section.forEach((image) => {
                URL.revokeObjectURL(image.url); // Clean up blob URLs
              });
            });
          }
        },
        onSuccess: (response) => {
          // console.log("Post created successfully:", response.data.createPost);
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
    setDuration(null); // Reset the duration to null to prevent auto-hide
  };

  useEffect(() => {
  if (draft && !draftInitializedRef.current) {
    // console.log("Applying draft data...");
    draftInitializedRef.current = true;

    const hydratedSectionImages = draft.sectionImages.map(section =>
      section.map(image => ({
        ...image,
        url: URL.createObjectURL(image.file),
      }))
    );

    setPostType(draft.postType);
    setSectionImages(hydratedSectionImages);
    setComment(draft.comment);
    setInternalMemo(draft.internalMemo);
    setUniqueId(draft.uniqueId || generateUniqueId(12));
    setActiveStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (!draft && postType && !draftInitializedRef.current) {
    // console.log("Initializing empty state from postType...");
    draftInitializedRef.current = true;

    const initialSectionImages = postType.sections.map(() => []);
    setSectionImages(initialSectionImages);
    setComment("");
    setInternalMemo("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [draft, postType]);

  return (
    <Box id="create-page" className="create-page">
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
            handleCommentInput={handleCommentInput}
            handleInternalMemoInput={handleInternalMemoInput}
            handleSaveDraft={handleSaveDraft}
            sectionImages={sectionImages}
            internalMemo={internalMemo}
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
        autoHideDuration={duration}
        onClose={handleCloseSnackbar}
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
    </Box>
  );
};
export default CreatePage;
