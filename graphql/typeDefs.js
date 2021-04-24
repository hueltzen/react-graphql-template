const gql = require("graphql-tag");

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    token: String!
  }
  type UserRef {
    id: ID!
    username: String!
    email: String!
  }

  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type Query {
    getUsers: [UserRef]!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(loginInput: LoginInput): User!
  }
`;
