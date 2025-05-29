// File: client/src/pages/HistoryPage/HistoryPage.js
// Description: This file contains the HistoryPage component, which displays a user's post history.

import { useQuery } from "@apollo/client";
import {
  Button,
  Link,
  Menu,
  MenuItem,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { GET_POSTS_BY_USER_ID } from "../../graphql/queries/postQueries";
import { getUserId } from "../../redux/selectors/settingsSelectors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./HistoryPage.css";
import { getLocalTimeZoneAbbreviation } from "../../util/TimeUtil";

function toLocalTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(); // Uses user's local time zone
}

const timeZoneAbbreviation = getLocalTimeZoneAbbreviation();

export const HistoryPage = () => {
  const loggedInUserId = useSelector(getUserId);
  const [after, setAfter] = useState(null);
  const [cursorStack, setCursorStack] = useState([]);
  // Track the anchorEl (menu position) for each post using an object
  const [anchorEls, setAnchorEls] = useState({});

  const handleClick = (event, postId) => {
    setAnchorEls((prevState) => ({
      ...prevState,
      [postId]: event.currentTarget, // Set anchorEl for the clicked postId
    }));
  };

  const handleClose = (postId) => {
    setAnchorEls((prevState) => ({
      ...prevState,
      [postId]: null, // Close the menu for the clicked postId
    }));
  };

  const { loading, error, data } = useQuery(GET_POSTS_BY_USER_ID, {
    variables: {
      userId: loggedInUserId,
      first: 10,
      after,
    },
    fetchPolicy: "network-only",
  });

  const handleNext = () => {
    if (data && data.getPostsByUserId.length > 0) {
      const lastTimestamp =
        data.getPostsByUserId[data.getPostsByUserId.length - 1].timestamp;
      setCursorStack((prev) => [...prev, after]);
      setAfter(lastTimestamp);
    }
  };

  const handlePrevious = () => {
    setCursorStack((prev) => {
      const newStack = [...prev];
      const prevCursor = newStack.pop() || null;
      setAfter(prevCursor);
      return newStack;
    });
  };

  return (
    <div
      className="container"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        backgroundColor: "background.default",
        padding: 3,
      }}
    >
      <Typography variant="h4" component="h1" className="title" gutterBottom>
        Post History
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error.message}
        </Typography>
      )}
      <TableContainer component={Paper} sx={{ maxWidth: 900, mb: 3 }}>
        <Table id="history-table" aria-label="history table">
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
                  {`Post Date (${timeZoneAbbreviation})`}
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress size={24} />
                  <span style={{ marginLeft: 8 }}>Loading...</span>
                </TableCell>
              </TableRow>
            ) : data &&
              data.getPostsByUserId &&
              data.getPostsByUserId.length > 0 ? (
              data.getPostsByUserId.map((post) => (
                <TableRow key={post.postId}>
                  <TableCell>{post.postType?.title || ""}</TableCell>
                  <TableCell>
                    {post.internalMemo !== null
                      ? `${post.internalMemo?.substring(0, 50)}${
                          post.internalMemo?.length > 50 ? "..." : ""
                        }`
                      : ""}
                  </TableCell>
                  <TableCell>{toLocalTime(post.timestamp)}</TableCell>
                  <TableCell>
                    {/* Visible "More" button (3 dots) */}
                    <IconButton
                      onClick={(event) => handleClick(event, post.postId)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEls[post.postId]} // Use the postId to get the anchorEl
                      open={Boolean(anchorEls[post.postId])} // Check if the menu should be open for this postId
                      onClose={() => handleClose(post.postId)} // Close the menu for this postId
                    >
                      <MenuItem onClick={() => handleClose(post.postId)}>
                        <Link
                          href={`/post/${post.postId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          color="primary"
                          underline="hover"
                        >
                          Open Link
                        </Link>
                      </MenuItem>
                      {/* Add more menu items as needed */}
                    </Menu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No posts found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box className="history-pagination" sx={{ display: "flex", gap: 2 }}>
        <Button
          variant="contained"
          onClick={handlePrevious}
          disabled={cursorStack.length === 0 || loading}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={
            loading ||
            !data ||
            !data.getPostsByUserId ||
            data.getPostsByUserId.length < 10
          }
        >
          Next
        </Button>
      </Box>
    </div>
  );
};

export default HistoryPage;
