import React from "react";
import App from "./App";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import Cookies from "universal-cookie";
import { setContext } from "apollo-link-context";

const uploadLink = createUploadLink({
  uri: "http://localhost:5000/graphql",
});

const authLink = setContext(() => {
  const cookies = new Cookies();
  const token = cookies.get("d_token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, uploadLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getCollections: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
        fields: {
          blocks: {
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});

export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
