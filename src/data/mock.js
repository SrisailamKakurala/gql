// src/data/mock.js

const users = [
    { id: "1", name: "Alice", email: "alice@example.com" },
    { id: "2", name: "Bob", email: "bob@example.com" },
  ];
  
const posts = [
  { id: "101", title: "GraphQL 101", content: "Learn GraphQL basics.", authorId: "1" },
  { id: "102", title: "Advanced GraphQL", content: "Deep dive into GraphQL.", authorId: "2" },
  { id: "103", title: "GraphQL Relations", content: "Nested resolvers in GraphQL.", authorId: "1" },
];
  
module.exports = { users, posts };