// File: client/src/components/ProfileSection/ProfileSection.js
// Description: This file contains the ProfileSection component which is used to display and edit user profile information.

import React, { useState } from "react";

import { useMutation } from "@apollo/client";
import { Button, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_USER_COMPANY } from "../../graphql/mutations/userMutations";
import { getUser } from "../../redux/selectors/settingsSelectors";

import { setUserCompany } from "../../redux/actions/settingsAction";

import "./ProfileSection.css";

const ProfileSection = () => {
  const dispatch = useDispatch();

  const [updateUserCompany] = useMutation(UPDATE_USER_COMPANY);

  const {
    id,
    username,
    email,
    name,
    company: initialCompany,
  } = useSelector(getUser);

  const [originalCompanyName, setOriginalCompanyName] =
    useState(initialCompany);

  const [formData, setFormData] = useState({
    name: name,
    username: username,
    email: email,
    company: initialCompany,
  });

  const handleCompanyChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isSaveDisabled = formData.company === originalCompanyName;

  const handleSubmit = (event) => {
    event.preventDefault();

    updateUserCompany({
      variables: {
        id: id,
        company: formData.company,
      },
      onError: (error) => {
        console.error("Error updating user company", error);
      },
      onCompleted: (response) => {
        dispatch(setUserCompany(response.updateUserCompany.company));
        setOriginalCompanyName(response.updateUserCompany.company);
      },
    });
  };

  return (
    <div className="profile-section">
      {/* User Field */}
      <TextField
        label="Name"
        variant="outlined"
        value={formData.name}
        disabled
      />

      {/* Username Field */}
      <TextField
        label="Username"
        variant="outlined"
        value={formData.username}
        disabled
      />

      {/* Email Field */}
      <TextField
        label="Email"
        variant="outlined"
        value={formData.email}
        disabled
      />

      {/* Editable Company Field */}
      <TextField
        label="Company"
        variant="outlined"
        name="company"
        value={formData.company}
        onChange={handleCompanyChange}
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
        disabled={isSaveDisabled}
      >
        Save
      </Button>
    </div>
  );
};

export default ProfileSection;
