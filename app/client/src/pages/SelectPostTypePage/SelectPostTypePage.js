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
import './SelectPostTypePage.css';

const SelectPostTypePage = ( { postType, handleRadioChange} ) => {
  const existingPostTypes = useSelector(getPostTypes);

  const handleChange = (event) => {
    const selectedId = event.target.value;
    const selectedItem = existingPostTypes.find(item => item.id.toString() === selectedId);
    handleRadioChange(selectedItem);
  }

    return (
        <div className="select-post-type-page">
          <FormControl>
            <FormLabel id="select-post-type-group-label">Select post type</FormLabel>
            <RadioGroup 
              name="radio-buttons-group"
              onChange={handleChange}
              value={postType && postType.id}
            >
              {
                Array.isArray(existingPostTypes) && existingPostTypes.length > 0 ? (
                  existingPostTypes.map((item, index) => (
                    <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.title} />
                  ))
                ) : (
                  <div> No post type exists </div>
                )
              }
            </RadioGroup>
          </FormControl>
        </div>
      );
}

export default SelectPostTypePage;