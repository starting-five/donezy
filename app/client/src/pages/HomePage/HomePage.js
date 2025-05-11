// File: client/src/pages/HomePage/HomePage.js
// Description: This file contains the HomePage component, which is responsible for displaying the user's information and handling user login/logout actions.

import { useMutation, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_LOG } from "../../graphql/mutations/logMutations";
import { CREATE_USER } from "../../graphql/mutations/userMutations";
import { GET_POST_TYPES_BY_USER_ID } from "../../graphql/queries/postTypeQueries";
import { GET_USER_BY_EMAIL } from "../../graphql/queries/userQueries";
import { setPostTypes, setUser } from "../../redux/actions/settingsAction";

const HomePage = () => {
  const loggedInUserId = useSelector(
    (state) => state.settings.user && state.settings.user.id
  );
  const { user, isAuthenticated } = useAuth0();
  const [createLog] = useMutation(CREATE_LOG);
  const [createUser] = useMutation(CREATE_USER);

  const dispatch = useDispatch();

  const {
    loading,
    data: userData,
  } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email: user.email },
    skip: !isAuthenticated, // Skip the query if not authenticated
  });

  const {
    data: postTypeData,
  } = useQuery(GET_POST_TYPES_BY_USER_ID, {
    skip: !userData,
    variables: { userId: userData?.getUserByEmail.id },
  });

  const hasLogged = sessionStorage.getItem("hasLoggedIn");
  const hasPostTypeFetched = sessionStorage.getItem("postTypesFetched");

  useEffect(() => {
    if (isAuthenticated && loggedInUserId == null) {
      if (userData && userData.getUserByEmail) {
        dispatch(setUser(userData.getUserByEmail));
      } else if (userData && !userData.getUserByEmail) {
        console.log("User ID is not in database");
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
          console.log("User created successfully:", response);
          dispatch(setUser(response.data.createUser));
        });
      }
    } else if (isAuthenticated && loggedInUserId) {
      // Create a log entry when the user logs in
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
          onCompleted: (response) => {
            console.log("Log created successfully:", response);
          },
        }).then((response) => {
          console.log("Log created successfully:", response.data.createLog);
        });
      }

      if (postTypeData && !hasPostTypeFetched) {
        dispatch(setPostTypes(postTypeData.getPostTypesByUserId));
        sessionStorage.removeItem("postTypesFetched");
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
  ]);

  return (
    <div className="container">
      <h1 className="title">Welcome back!</h1>
      {!loading && (
        <div key={user.id} className="user-card">
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;
