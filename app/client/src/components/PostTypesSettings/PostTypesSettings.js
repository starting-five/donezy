// File: client/src/components/PostTypesSettings/PostTypesSettings.js
// Description: This file contains the PostTypesSettings component which is used to manage post types in the application.

import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostTypes,
  getUserId,
} from "../../redux/selectors/settingsSelectors";
import "./PostTypesSettings.css";

import { useMutation } from "@apollo/client";
import { CREATE_POST_TYPE } from "../../graphql/mutations/postTypeMutations";
import { addPostType } from "../../redux/actions/settingsAction";

const PostTypesSettings = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newPostTypeName, setNewPostTypeName] = useState("");
  const [imageSections, setImageSections] = useState([{ title: "" }]);
  const existingPostTypes = useSelector(getPostTypes);
  const userId = useSelector(getUserId);
  const [postTypes, setPostTypes] = useState(existingPostTypes);

  const [createPostType] = useMutation(CREATE_POST_TYPE);

  const dispatch = useDispatch();

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    clearFields();
    setOpenDialog(false);
  };

  const handleAddImageSection = () => {
    setImageSections([...imageSections, { title: "" }]);
  };

  const handleImageSectionChange = (index, value) => {
    const updatedSections = [...imageSections];
    updatedSections[index].title = value;
    setImageSections(updatedSections);
  };

  const handleDeleteImageSection = (index) => {
    if (imageSections.length > 1) {
      const updatedSections = imageSections.filter((_, i) => i !== index);
      setImageSections(updatedSections);
    }
  };

  const clearFields = () => {
    setNewPostTypeName("");
    setImageSections([{ title: "" }]);
  };

  const handleAddPostType = () => {
    const newPostType = {
      title: newPostTypeName,
      sections: imageSections.map((section) => section.title),
    };

    createPostType({
      variables: {
        userId: userId,
        title: newPostTypeName,
        sections: imageSections.map((section) => section.title),
      },
      onError: (error) => {
        console.error("Error adding post type", error);
      },
      onCompleted: (response) => {
        console.log("Post type added successfully: ", response);
        const newPostType = response.createPostType;
        delete newPostType.userId;
        dispatch(addPostType(newPostType));
      },
    });

    setPostTypes([...postTypes, newPostType]);
    clearFields();
    setOpenDialog(false);
  };

  console.log("before return");
  return (
    <div className="post-type-settings">
      <div className="table-wrapper">
        {/* Table to List Post Types */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Post Type Name</TableCell>
              <TableCell>Image Sections</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {postTypes.map((postType, index) => (
              <TableRow key={index}>
                <TableCell>{postType.title}</TableCell>
                <TableCell>{postType.sections.join(", ")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog to Add New Post Type */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          sx={{
            "& .MuiDialog-paper": {
              width: "500px",
              maxWidth: "500px",
              margin: "auto",
              height: "100%",
            },
          }}
          id="add-post-type-dialog"
        >
          <DialogTitle>Add New Post Type</DialogTitle>
          <DialogContent>
            <TextField
              label="Post Type Name"
              fullWidth
              value={newPostTypeName}
              onChange={(e) => setNewPostTypeName(e.target.value)}
              sx={{ marginBottom: "16px", marginTop: "16px" }}
              required
            />
            {imageSections.map((section, index) => (
              <div
                key={index}
                className="dialog-content-section"
              >
                <TextField
                  label={`Image Section ${index + 1} Name`}
                  value={section.title}
                  onChange={(e) =>
                    handleImageSectionChange(index, e.target.value)
                  }
                  fullWidth
                  sx={{ marginRight: "8px" }}
                  required
                />
                <IconButton
                  onClick={() => handleDeleteImageSection(index)}
                  color="error"
                  disabled={imageSections.length === 1}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
            <Button
              onClick={handleAddImageSection}
              variant="outlined"
              className="add-image-section-btn"
            >
              Add Another Image Section
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              variant="contained"
              disabled={
                !newPostTypeName ||
                imageSections.some((section) => !section.title)
              }
              onClick={handleAddPostType}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Button
        id="addNewPostTypeBtn"
        onClick={handleOpenDialog}
        variant="contained"
      >
        Add New Post Type
      </Button>
    </div>
  );
};

export default PostTypesSettings;
