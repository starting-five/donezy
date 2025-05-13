// File: client/src/pages/SelectPostTypePage/SelectPostTypePage.js
// Description: This file contains the SelectPostTypePage component, which allows users to select a post type from a list of available post types.

import React from 'react';
import { getPostTypes } from '../../redux/selectors/settingsSelectors';
import { useSelector } from 'react-redux';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import './SelectPostTypePage.css';

const SelectPostTypePage = ({ postType, handleRadioChange }) => {
  const existingPostTypes = useSelector(getPostTypes);

  const handleChange = (event) => {
    const selectedId = event.target.value;
    const selectedItem = existingPostTypes.find(item => item.id.toString() === selectedId);
    handleRadioChange(selectedItem);
  };

  return (
    <Box
      className="select-post-type-page"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start", // Move content to the top
        minHeight: "80vh",
        backgroundColor: "background.default",
        padding: 3,
        pt: 8, // Add some padding to the top for spacing
      }}
    >
      <Paper elevation={3} sx={{ p: 4, minWidth: 350, maxWidth: 500 }}>
        <FormControl component="fieldset" sx={{ width: "100%" }}>
          <FormLabel
            id="select-post-type-group-label"
            sx={{ fontWeight: "bold", color: "primary.main", mb: 1 }}
          >
            Choose from your available post types:
          </FormLabel>
          <RadioGroup
            name="radio-buttons-group"
            onChange={handleChange}
            value={postType && postType.id}
          >
            {Array.isArray(existingPostTypes) && existingPostTypes.length > 0 ? (
              existingPostTypes.map((item) => (
                <FormControlLabel
                  key={item.id}
                  value={item.id}
                  control={<Radio color="primary" />}
                  label={item.title}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                No post type exists
              </Typography>
            )}
          </RadioGroup>
        </FormControl>
      </Paper>
    </Box>
  );
};

export default SelectPostTypePage;