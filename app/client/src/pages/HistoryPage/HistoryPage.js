import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from "@apollo/client";
import { GET_POSTS_BY_USER_ID } from '../../graphql/queries/postQueries';


export const HistoryPage = () => {
  const loggedInUserId = useSelector((state) => state.user.userId);
  const { loading, error, data } = useQuery(GET_POSTS_BY_USER_ID, {
    variables: { userId: loggedInUserId },
  });

  useEffect(() => {
    if (data && data.getPostsByUserId) {
      console.log("User posts:", data.getPostsByUserId);
    }
  }, [data]);


  return (
    <div className="container">
      <h1 className="title">History Page</h1>
      <p>This is the history page where you can view and manage posts.</p>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}  
      {data && data.getPostsByUserId && data.getPostsByUserId.length > 0 ? (
        <ul>
          {data.getPostsByUserId.map((post) => (
            <li key={post.postId}>
              <p>Post ID: {post.postId}</p>
              <p>User ID: {post.userId}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}
export default HistoryPage;