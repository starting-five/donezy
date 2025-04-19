import { useMutation, useQuery } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_LOG } from "../../graphql/mutations/logMutations";
import { CREATE_USER } from "../../graphql/mutations/userMutations";
import { GET_USER_BY_EMAIL } from "../../graphql/queries/userQueries";
import { setUserId } from "../../redux/actions/userActions";

const HomePage = () => {
  const loggedInUserId = useSelector((state) => state.user.userId);
  const { user, isAuthenticated } = useAuth0();
  const [createLog] = useMutation(CREATE_LOG);
  const [createUser] = useMutation(CREATE_USER);

  const logCreatedRef = useRef(false);
  const dispatch = useDispatch();

  const {
    loading,
    error,
    data: userData,
  } = useQuery(GET_USER_BY_EMAIL, {
    variables: { email: user.email },
    skip: !isAuthenticated, // Skip the query if not authenticated
  });

  useEffect(() => {
    if (isAuthenticated && loggedInUserId == null) {
      console.log("User ID in redux state is null");
      if (userData && userData.getUserByEmail) {
        console.log("User ID is in database");
        dispatch(setUserId(userData.getUserByEmail.id));
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
          dispatch(setUserId(response.data.createUser.id));
        });
      }
    } else if (isAuthenticated && loggedInUserId) {
      // Create a log entry when the user logs in
      if (!logCreatedRef.current) {
        logCreatedRef.current = true;
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
    }
  }, [
    isAuthenticated,
    user,
    userData,
    createUser,
    dispatch,
    loggedInUserId,
    createLog,
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
