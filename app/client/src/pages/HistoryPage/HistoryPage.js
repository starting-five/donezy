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
    <div className="container">
      <h1 className="title">History Page</h1>
      {error && <p>Error: {error.message}</p>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Post Type Title</TableCell>
              <TableCell>Post ID</TableCell>
              <TableCell>{`Timestamp (${userTimeZone})`}</TableCell>
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
                      href={`http://localhost:3000/post/${post.postId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                    >
                      {`localhost:3000/post/${post.postId}`}
                    </Link>
                  </TableCell>
                  <TableCell>{toLocalTime(post.timestamp)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No posts found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="history-pagination">
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
      </div>
    </div>
  );
};

export default HistoryPage;
