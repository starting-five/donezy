import { useMutation } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useRef } from "react";
import { CREATE_LOG } from "../../graphql/mutations/logMutations";
import { useDispatch, useSelector } from "react-redux";
import { setUserId } from "../../redux/actions/userActions";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const [createLog] = useMutation(CREATE_LOG);

  const logCreatedRef = useRef(false);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);

  useEffect(() => {
    // Create a log entry when the user logs in
    if (isAuthenticated && !logCreatedRef.current) {
      logCreatedRef.current = true;
      createLog({
        variables: {
          user: {
            name: user.name,
            username: user.nickname,
            email: user.email,
          },
          action: "login",
        },
        onError: (error) => {
          console.error("Error logging user login", error);
        },
      }).then((response) => {
        console.log("Log created successfully:", response.data.createLog);
        // Dispatch the user ID to the Redux store
        dispatch(setUserId(response.data.createLog.userId));
      });
    }
  }, [isAuthenticated, user, createLog, dispatch]);

  return (
    <div className="container">
      <h1 className="title">Welcome back!</h1>
      {/* {
                !loading && data.getUsers && data.getUsers.map((user) => (
                    <div key={user.id} className="user-card">
                        <h2>{user.name}</h2>
                        <p>Email: {user.email}</p>
                        <p>Username: {user.username}</p>
                    </div>
                ))
            } */}
    </div>
  );
};

export default HomePage;