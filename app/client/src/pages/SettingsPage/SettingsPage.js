import CloseIcon from "@mui/icons-material/Close";
import { Box, Drawer, List, ListItem, ListItemText } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PostTypesSettings from "../../components/PostTypesSettings/PostTypesSettings";
import ProfileSection from "../../components/ProfileSection/ProfileSection";
import { toggleSettingsModal } from "../../redux/actions/settingsAction";
import "./SettingsPage.css";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({}));

export default function CustomizedDialogs() {
  const isModalOpen = useSelector((state) => state.settings.isModalOpen);
  const [selectedSection, setSelectedSection] = useState("Profile");
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(toggleSettingsModal());
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  return (
    <React.Fragment>
      {isModalOpen && (
        <BootstrapDialog
          id="settings-modal"
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={isModalOpen}
          fullWidth="lg"
          maxWidth="lg"
        >
          <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
            Settings
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent id="dialog-content" dividers={false}>
            <Drawer
              id="settings-drawer"
              variant="permanent"
              anchor="left"
            >
              <Box id="settings-box">
                <List id="settings-list">
                  {["Profile", "Post Types"].map((text) => (
                    <ListItem
                      button
                      key={text}
                      onClick={() => handleSectionChange(text)}
                    >
                      <ListItemText primary={text} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Drawer>
            <Box className="settings-content-area">
              <Box sx={{ width: "100%" }}>
                {selectedSection === "Profile" && <ProfileSection />}
                {selectedSection === "Post Types" && <PostTypesSettings />}
              </Box>
            </Box>
          </DialogContent>
        </BootstrapDialog>
      )}
    </React.Fragment>
  );
}
