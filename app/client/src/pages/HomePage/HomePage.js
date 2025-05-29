// File: client/src/pages/HomePage/HomePage.js
// Description: This file contains the HomePage component, which is responsible for displaying the user's information and handling user login/logout actions.

import { useMutation, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loadUserDrafts } from "../../dexie/loadDraft";
import { CREATE_LOG } from "../../graphql/mutations/logMutations";
import { CREATE_USER } from "../../graphql/mutations/userMutations";
import { GET_POST_TYPES_BY_USER_ID } from "../../graphql/queries/postTypeQueries";
import { GET_USER_BY_EMAIL } from "../../graphql/queries/userQueries";
import { setPostTypes, setUser } from "../../redux/actions/settingsAction";
import { getLocalTimeZoneAbbreviation } from "../../util/TimeUtil";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteRoumndedIcon from "@mui/icons-material/DeleteRounded";
import { deleteDraft } from "../../dexie/deleteDraft";

const HomePage = () => {
  const loggedInUserId = useSelector(
    (state) => state.settings.user && state.settings.user.id
  );
  const { user, isAuthenticated } = useAuth0();
  const [createLog] = useMutation(CREATE_LOG);
  const [createUser] = useMutation(CREATE_USER);
  const [draftsLoaded, setDraftsLoaded] = React.useState(false);
  const [drafts, setDrafts] = useState([]);
  const [anchorEls, setAnchorEls] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const timeZoneAbbreviation = getLocalTimeZoneAbbreviation();

  const { loading, data: userData } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email: user.email },
    skip: !isAuthenticated,
  });

  const { data: postTypeData } = useQuery(GET_POST_TYPES_BY_USER_ID, {
    skip: !userData,
    variables: { userId: userData?.getUserByEmail?.id },
  });

  const hasLogged = sessionStorage.getItem("hasLoggedIn");
  const hasPostTypeFetched = sessionStorage.getItem("postTypesFetched");
  

  const handleClick = (event, uniqueId) => {
    setAnchorEls((prevState) => ({
      ...prevState,
      [uniqueId]: event.currentTarget, // Set anchorEl for the clicked uniqueId
    }));
  };

  const handleClose = (uniqueId) => {
    requestAnimationFrame(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    });
    setAnchorEls((prevState) => ({
      ...prevState,
      [uniqueId]: null, // Close the menu for the clicked postId
    }));
  };

  const handleEditDraft = (draft) => {
    navigate(`/create?draftId=${draft.uniqueId}`, { state: { draft } });
  };

  const handleDeleteClick = (draft) => {
    setSelectedDraft(draft);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDraft) {
      deleteDraft(selectedDraft.uniqueId)
        .then(() => {
          // console.log("Draft successfully deleted:", selectedDraft.uniqueId);
          setDrafts((prevDrafts) =>
            prevDrafts.filter((d) => d.uniqueId !== selectedDraft.uniqueId)
          );
        })
        .catch((error) => {
          console.error("Error deleting draft:", error);
        });
    }
    setOpenConfirm(false);
    setSelectedDraft(null);
  };

  const handleCancelDelete = () => {
    setOpenConfirm(false);
    setSelectedDraft(null);
    handleClose(selectedDraft?.uniqueId);
  };

  useEffect(() => {
    if (isAuthenticated && loggedInUserId == null) {
      if (userData && userData.getUserByEmail) {
        dispatch(setUser(userData.getUserByEmail));
      } else if (userData && !userData.getUserByEmail) {
        createUser({
          variables: {
            name: user.name,
            username: user.nickname,
            email: user.email,
          },
          onError: (error) => {
            console.error("Error creating user", error);
          },
        }).then((response) => {
          dispatch(setUser(response.data.createUser));
        });
      }
    } else if (isAuthenticated && loggedInUserId) {
      if (!hasLogged) {
        sessionStorage.setItem("hasLoggedIn", true);
        createLog({
          variables: {
            userId: loggedInUserId,
            action: "login",
          },
          onError: (error) => {
            console.error("Error logging user login", error);
          },
        });
      }

      if (postTypeData && !hasPostTypeFetched) {
        dispatch(setPostTypes(postTypeData.getPostTypesByUserId));
        sessionStorage.removeItem("postTypesFetched");
      }

      if (!draftsLoaded) {
        async function fetchUserDrafts() {
          const drafts = await loadUserDrafts(loggedInUserId);
          setDrafts(drafts);
          setDraftsLoaded(true);
        }

        fetchUserDrafts();
      }
    }
  }, [
    isAuthenticated,
    user,
    userData,
    createUser,
    dispatch,
    loggedInUserId,
    createLog,
    postTypeData,
    hasLogged,
    hasPostTypeFetched,
    draftsLoaded,
  ]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <Box
      className="container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflowY: "auto",
      }}
    >
      <Typography variant="h5" component="h5" className="title" gutterBottom>
        Welcome back {user?.name}!
      </Typography>

      <Divider sx={{ my: 2, borderColor: "text.secondary", width: "100%" }} />

      <Typography variant="h6" color="text.primary">
        Drafts
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 2, maxWidth: 900 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Post Type
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Internal Memo
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  {`Modified Date (${timeZoneAbbreviation})`}
                </Typography>
              </TableCell>
              <TableCell sx={{ width: 12 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold" }}
                ></Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {drafts && drafts.length > 0 ? (
              drafts.map((draft) => (
                <TableRow key={draft.uniqueId}>
                  <TableCell>{draft.postType?.title || "—"}</TableCell>
                  <TableCell>{draft.internalMemo || "—"}</TableCell>
                  <TableCell>
                    {new Date(draft.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {/* Visible "More" button (3 dots) */}
                    <IconButton
                      onClick={(event) => handleClick(event, draft.uniqueId)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEls[draft.uniqueId]} // Use the postId to get the anchorEl
                      open={Boolean(anchorEls[draft.uniqueId])} // Check if the menu should be open for this postId
                      onClose={() => handleClose(draft.uniqueId)} // Close the menu for this postId
                      disableAutoFocusItem
                    >
                      <MenuItem onClick={() => handleEditDraft(draft)}>
                        <EditNoteIcon
                          fontSize="small"
                          sx={{ fontSize: 20, color: "text.secondary", mr: 1 }}
                        />
                        <Link
                          component="span"
                          color="primary"
                          underline="hover"
                        >
                          Edit
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={() => handleDeleteClick(draft)}>
                        <DeleteRoumndedIcon
                          fontSize="small"
                          sx={{ fontSize: 20, color: "error.main", mr: 1 }}
                        />
                        <Link
                          component="span"
                          color="error.main"
                          underline="hover"
                        >
                          Delete
                        </Link>
                      </MenuItem>
                      {/* Add more menu items as needed */}
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} sx={{ textAlign: "center", padding: 3 }}>
                  <Typography variant="subtitle1" color="text.secondary">
                    You have no saved drafts. You can start a new post{" "}
                    <Link
                      component="span"
                      color="primary"
                      underline="hover"
                      onClick={() => navigate("/create")}
                      sx={{ cursor: "pointer" }}
                    >
                      here
                    </Link>
                    .
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={openConfirm}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-delete-dialog-title"
      >
        <DialogTitle id="confirm-delete-dialog-title">
          Delete Draft?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this draft? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;
