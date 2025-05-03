/*
Modus Operandi:

1. Create a simple GraphQL server with Apollo Server [pass typedefs, resolvers as args].
2. write typeDefs.. they include the Query and Mutation types and other common types used in them.
3. write resolvers.. they define how to respond to queries and mutations.
4. start the server

*/


const { ApolloServer, gql } = require('apollo-server');

// 🧾 Type Definitions (Schema)
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getUsers: [User!]!
  }

  type Mutation {
    addUser(name: String!, email: String!): User!
  }
`;

// Fake database (in-memory array)
const users = [
  { id: "1", name: "Alice", email: "alice@example.com" },
  { id: "2", name: "Bob", email: "bob@example.com" },
];

// 🧠 Resolvers
const resolvers = {
  Query: {
    getUsers: () => users,
  },
  Mutation: {
    addUser: (_, { name, email }) => {
      const newUser = {
        id: String(users.length + 1),
        name,
        email,
      };
      users.push(newUser);
      return newUser;
    },
  },
};

// 🚀 Start the Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});