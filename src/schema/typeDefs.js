// src/schema/typeDefs.js

const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  type Query {
    getUsers: [User!]!
    getPosts: [Post!]!
  }

  type Mutation {
    addUser(name: String!, email: String!): User!
    addPost(title: String!, content: String!, authorId: ID!): Post!
  }
`;

module.exports = typeDefs;