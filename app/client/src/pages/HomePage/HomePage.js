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
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CircularProgress from "@mui/material/CircularProgress";

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
    skip: !isAuthenticated,
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

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div
      className="container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
      }}
    >
      <Typography variant="h3" component="h1" className="title" gutterBottom>
        Welcome back!
      </Typography>
      {user && (
        <Card sx={{ minWidth: 320, mt: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              {user.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Email: {user.email}
            </Typography>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HomePage;
