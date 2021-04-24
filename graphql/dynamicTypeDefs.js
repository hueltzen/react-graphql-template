const gql = require("graphql-tag");

module.exports = async () => {
  const dynamicTypeDefs = `
        type ${modelDef.name} {
            fields: [String]
        }
    `;

  return gql(String.raw`
        ${dynamicTypeDefs}
    `);
};

// module.exports = gql(String.raw`
//     ${dynamicTypeDefs}
// `);

// module.exports = gql`
//   type Post {
//     id: ID!
//     body: String!
//     username: String!
//     user: ID!
//     createdAt: String!
//   }
//   type User {
//     id: ID!
//     username: String!
//     email: String!
//     token: String!
//   }

//   input RegisterInput {
//     username: String!
//     password: String!
//     confirmPassword: String!
//     email: String!
//   }

//   input LoginInput {
//     username: String!
//     password: String!
//   }

//   type Query {
//     getPosts: [Post]
//     getPost(postId: ID!): Post
//   }
//   type Mutation {
//     register(registerInput: RegisterInput): User!
//     login(loginInput: LoginInput): User!
//     createPost(body: String!): Post!
//     deletePost(postId: ID!): String!
//   }
// `;
