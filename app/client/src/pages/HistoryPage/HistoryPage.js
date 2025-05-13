// File: client/src/pages/HistoryPage/HistoryPage.js
// Description: This file contains the HistoryPage component, which displays a user's post history.

import { useQuery } from "@apollo/client";
import {
  Button,
  Link,
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
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { GET_POSTS_BY_USER_ID } from "../../graphql/queries/postQueries";
import { getUserId } from "../../redux/selectors/settingsSelectors";
import "./HistoryPage.css";

function toLocalTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(); // Uses user's local time zone
}

const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const HistoryPage = () => {
  const loggedInUserId = useSelector(getUserId);
  const [after, setAfter] = useState(null);
  const [cursorStack, setCursorStack] = useState([]);

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
    <Box
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
      <Typography variant="h3" component="h1" className="title" gutterBottom>
        History Page
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error.message}
        </Typography>
      )}
      <TableContainer component={Paper} sx={{ maxWidth: 900, mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Post Type Title
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  Post ID
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                  {`Timestamp (${userTimeZone})`}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <CircularProgress size={24} />
                  <span style={{ marginLeft: 8 }}>Loading...</span>
                </TableCell>
              </TableRow>
            ) : data && data.getPostsByUserId && data.getPostsByUserId.length > 0 ? (
              data.getPostsByUserId.map((post) => (
                <TableRow key={post.postId}>
                  <TableCell>{post.postType?.title || ""}</TableCell>
                  <TableCell>
                    <Link
                      href={`/post/${post.postId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      underline="hover"
                    >
                      {`${post.postId}`}
                    </Link>
                  </TableCell>
                  <TableCell>{toLocalTime(post.timestamp)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
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
    </Box>
  );
};

export default HistoryPage;
