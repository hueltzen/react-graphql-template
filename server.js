const fs = require("fs");
const path = require("path");
const os = require("os");

const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const mongoose = require("mongoose");
const gql = require("graphql-tag");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

require("dotenv").config();

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to DB");

    const server = new ApolloServer({
      typeDefs: [typeDefs],
      resolvers: [resolvers],
      context: ({ req }) => ({ req }),
    });

    const app = express();
    app.use(express.static(path.join(os.homedir(), "/.duality/public/")));
    server.applyMiddleware({ app });

    app.listen({ port: 5000 }, () => {
      console.log(
        `🚀 Server ready at http://localhost:5000${server.graphqlPath}`
      );
    });
  });
