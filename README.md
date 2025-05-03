# gql
graphql practice and notes

### [Roadmap](./Roadmap.md)

---

# 🧱 PHASE 1: Core GraphQL Concepts (Hands-on First Principles)

---

## ⚒️ STEP 0: What We’re Going to Do in PHASE 1

We’ll:

1. Learn **what GraphQL is** (vs REST).
2. Learn the **core GraphQL concepts**.
3. Create a simple GraphQL server with Apollo Server.
4. Create our first **Query** (`getUsers`) and **Mutation** (`addUser`).
5. Test using **Apollo Studio** or **GraphQL Playground**.

---

## 💡 1. What is GraphQL? (vs REST)

### 🤔 REST

* In REST, you have **multiple endpoints**.
* Example:

  * `GET /users`
  * `POST /users`
  * `GET /users/1/posts`

**Problems with REST:**

* Over-fetching (getting more data than needed).
* Under-fetching (not getting enough, need multiple requests).
* Too many endpoints = messy API.

---

### 🌟 GraphQL (The Hero)

* **One endpoint**: `/graphql`
* You **write a query** that tells the server *exactly* what you need.
* It’s like ordering a custom meal vs choosing a pre-cooked meal.

> "Don't give me everything. Just give me `id` and `name` of users."

You define **what** you want, and GraphQL gives **exactly that**.

---

## 📦 2. Project Setup (Windows + pnpm)

```bash
mkdir graphql-phase-1
cd graphql-phase-1
pnpm init -y
pnpm add apollo-server graphql
```

You should now have:

* `node_modules/`
* `package.json`

Create a file:

```bash
touch index.js
```

(Or just use VS Code > New File > `index.js`)

---

## 🧠 3. GraphQL Terms Explained

### 🧬 Schema

* The **blueprint** of your data.
* Example:

  ```graphql
  type User {
    id: ID
    name: String
    email: String
  }
  ```

### 🧾 TypeDefs

* "Type Definitions"
* Define **what data exists**, and **what you can do with it** (queries & mutations).

### 🔍 Query

* Read-only operation.
* "I want to get data."
* Example:

  ```graphql
  getUsers: [User]
  ```

### ✏️ Mutation

* Write operation.
* "I want to change data."
* Example:

  ```graphql
  addUser(name: String, email: String): User
  ```

### 🔁 Subscription (We'll skip this now)

* Real-time operations. You subscribe to updates.
* Like: “notify me when a new message arrives.”

### 🧠 Resolvers

* The **functions** that actually run behind the scenes.
* They tell GraphQL **how to get the data** when a query/mutation is called.

---

## 🧱 4. Basic GraphQL Types

| Type      | Meaning                  |
| --------- | ------------------------ |
| `String`  | Text (e.g., name, email) |
| `Int`     | Whole number             |
| `Float`   | Decimal                  |
| `Boolean` | true / false             |
| `ID`      | Unique identifier        |

You can also use:

* `!` for **non-nullable** (`String!` means required).
* `[]` for **arrays** (`[User]` means array of users).

---

## 📄 5. Full Code: Apollo Server + Query + Mutation

Here’s a complete `index.js`:

```js
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
```

---

## ▶️ 6. Run It

In your terminal:

```bash
node index.js
```

You’ll see:

```
🚀 Server ready at http://localhost:4000/
```

Click the URL or open in browser → You’ll see **Apollo Studio Explorer**.

---

## 🧪 7. Test Your API

### ✅ Query: `getUsers`

```graphql
query {
  getUsers {
    id
    name
    email
  }
}
```

You’ll get:

```json
{
  "data": {
    "getUsers": [
      { "id": "1", "name": "Alice", "email": "alice@example.com" },
      { "id": "2", "name": "Bob", "email": "bob@example.com" }
    ]
  }
}
```

---

### ✏️ Mutation: `addUser`

```graphql
mutation {
  addUser(name: "Sri", email: "sri@example.com") {
    id
    name
    email
  }
}
```

Then do the `getUsers` query again — you’ll see Sri added.

---

## 🎯 Recap

You now understand:

* ✅ What GraphQL is (and how it's better than REST)
* ✅ What schemas, typeDefs, queries, mutations, and resolvers are
* ✅ Basic types and how they work
* ✅ How to set up and test Apollo Server on Windows with pnpm

---