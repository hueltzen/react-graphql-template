const usersResolvers = require("./resolvers/users");

module.exports = {
  Query: {
    ...usersResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
  },
};
