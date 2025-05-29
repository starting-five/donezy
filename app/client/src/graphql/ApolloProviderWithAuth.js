import React, { useMemo } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { useAuth0 } from "@auth0/auth0-react";

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_GRAPHQL_SERVER_URL,
});

const ApolloProviderWithAuth = ({ children }) => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const authLink = setContext(async (_, { headers }) => {
    let token = "";
    try {
      if (isAuthenticated) {
        token = await getAccessTokenSilently();
      }
    } catch (e) {
      token = "";
    }
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = useMemo(
    () =>
      new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
      }),
    [authLink]
  );

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderWithAuth;