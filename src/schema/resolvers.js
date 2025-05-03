// src/schema/resolvers.js

const { users, posts } = require("../data/mock");

const resolvers = {
  Query: {
    getUsers: () => users,
    getPosts: () => posts,
  },

  Mutation: {
    addUser: (_, { name, email }) => {
      const newUser = { id: String(users.length + 1), name, email };
      users.push(newUser);
      return newUser;
    },
    addPost: (_, { title, content, authorId }) => {
      const newPost = { id: String(posts.length + 101), title, content, authorId };
      posts.push(newPost);
      return newPost;
    },
  },

  // 🧩 Nested field resolvers
  User: {
    posts: (parent) => {
      return posts.filter((post) => post.authorId === parent.id);
    },
  },
  Post: {
    author: (parent) => {
      return users.find((user) => user.id === parent.authorId);
    },
  },
};

module.exports = resolvers;