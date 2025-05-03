# gql
graphql practice and notes

> ## 🌟 LEAVE A STAR IF YOU LIKED IT!

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

# 🧪 PHASE 2: Real App Basics – Modular Code Structure

---

## 🎯 Phase 2 Goal

* Learn to **modularize** `typeDefs` and `resolvers`
* Add another type: `Post`
* Create **relations**: `User.posts` and `Post.author`
* Practice **manual resolver logic** for nested relationships

---

## 📁 Step 1: Folder Structure

Let’s start with this:

```bash
mkdir graphql-phase-2
cd graphql-phase-2
pnpm init -y
pnpm add apollo-server graphql
mkdir -p src/schema src/data src/utils
```

Now, structure:

```
graphql-phase-2/
└── src/
    ├── schema/
    │   ├── typeDefs.js
    │   ├── resolvers.js
    ├── data/
    │   └── mock.js
    ├── utils/
    └── index.js
```

---

## 📦 Step 2: Setup Mock Data

Inside `src/data/mock.js`:

```js
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
```

---

## 🧾 Step 3: Define Modular TypeDefs

```js
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
```

---

## 🧠 Step 4: Modular Resolvers (With Relational Logic)

```js
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
```

---

## 🚀 Step 5: Apollo Server Setup

```js
// src/index.js

const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server running at ${url}`);
});
```

---

## 🧪 Step 6: Test Your Nested Data

### ✅ Query all posts and authors

```graphql
query {
  getPosts {
    id
    title
    author {
      name
    }
  }
}
```

### ✅ Query all users with their posts

```graphql
query {
  getUsers {
    name
    posts {
      title
    }
  }
}
```

### ✏️ Add a new post

```graphql
mutation {
  addPost(title: "New Post", content: "Test content", authorId: "2") {
    id
    title
    author {
      name
    }
  }
}
```

---

## 🎯 Recap

* ✅ Clean project structure with `/schema`, `/data`
* ✅ Split typeDefs and resolvers
* ✅ Manual resolution of relations:

  * `User.posts` (filter)
  * `Post.author` (find)
* ✅ Apollo Server configured modularly

---


Great question, Sri — and it’s a *critical* concept in GraphQL resolver logic.

---

### 🔍 What is `parent` in GraphQL resolvers?

In GraphQL, when resolving **nested fields** like `User.posts` or `Post.author`, the resolver **receives the parent object** — i.e., the object that "contains" the current field being resolved.

---

### 🧠 Think of it like this:

When GraphQL executes a query like:

```graphql
{
  getUsers {
    name
    posts {
      title
    }
  }
}
```

It goes step by step:

1. **Resolve `getUsers`** — this returns an array of `User` objects.
2. For each `User`, GraphQL tries to resolve the `posts` field.
3. That’s where your nested resolver:

```js
User: {
  posts: (parent) => { ... }
}
```

comes in.

Here, `parent` is the **specific user object** from step 1. So you can access `parent.id`, `parent.name`, etc.

---

### ✅ Real Example:

Let’s say this was the result of `getUsers`:

```js
[
  { id: "1", name: "Alice" },
  { id: "2", name: "Bob" }
]
```

Now when resolving `User.posts`:

```js
User: {
  posts: (parent) => {
    // first call: parent = { id: "1", name: "Alice" }
    // second call: parent = { id: "2", name: "Bob" }
    return posts.filter(post => post.authorId === parent.id);
  }
}
```

So each time, `parent` gives you the **current parent object**, letting you resolve its child fields dynamically.

---

### 📌 Summary:

* `parent` is the **object returned by the parent field** in the GraphQL query.
* It's used to **resolve nested fields** that depend on the context.
* For top-level queries like `getUsers`, `parent` is `undefined`.
* For nested fields like `User.posts`, it gives you the user so you can fetch their posts.

---


# 🧰 PHASE 3: Connect with Real DB (Mongo or PostgreSQL)

Absolutely, Sri — this will be a **production-grade** and comprehensive guide for **Phase 3: Connect GraphQL with a real DB (MongoDB + Mongoose *and* PostgreSQL + Prisma)** using Apollo Server. We’ll cover:

* 🧱 Full setup for **MongoDB + Mongoose**
* 🏛️ Full setup for **PostgreSQL + Prisma**
* ⚙️ Use of `context` to share DB access
* 🧩 Relational modeling (User ↔ Posts)
* 🛠️ Real CRUD (create/read/update/delete)
* 🧼 Clean folder structure

---

## ⚖️ MongoDB vs PostgreSQL — TL;DR

| Feature   | MongoDB                       | PostgreSQL                       |
| --------- | ----------------------------- | -------------------------------- |
| Type      | NoSQL document DB (flexible)  | Relational SQL DB (strict types) |
| Modeling  | Mongoose schema               | Prisma schema                    |
| Relations | Manual via IDs                | Built-in foreign keys            |
| Great for | Flexibility, fast prototyping | Data integrity, strong relations |

We’ll do **both**, side-by-side. Use either depending on your future app needs.

---

## 🧱 PART 1: MongoDB + Mongoose

---

### ✅ 1. Project Setup

```bash
pnpm init -y
pnpm add apollo-server graphql mongoose dotenv
mkdir -p src/{schema,data,models,utils}
touch .env
```

---

### 🗃 2. File Structure

```
/src
  /schema
    - typeDefs.js
    - resolvers.js
  /models
    - User.js
    - Post.js
  /utils
    - db.js
  index.js
.env
```

---

### 🌱 3. Environment Variables

`.env`:

```
MONGO_URI=mongodb://localhost:27017/graphql_db
```

---

### 🧩 4. Mongoose Models

`src/models/User.js`:

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

module.exports = mongoose.model("User", userSchema);
```

`src/models/Post.js`:

```js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Post", postSchema);
```

---

### 🔌 5. MongoDB Connection

`src/utils/db.js`:

```js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB error", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

### 📐 6. GraphQL Schema

`src/schema/typeDefs.js`:

```js
const { gql } = require("apollo-server");

module.exports = gql`
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
```

---

### 🧠 7. Resolvers

`src/schema/resolvers.js`:

```js
const User = require("../models/User");
const Post = require("../models/Post");

module.exports = {
  Query: {
    getUsers: () => User.find(),
    getPosts: () => Post.find().populate("author"),
  },
  Mutation: {
    addUser: (_, { name, email }) => User.create({ name, email }),
    addPost: (_, { title, content, authorId }) =>
      Post.create({ title, content, author: authorId }),
  },
  User: {
    posts: (parent) => Post.find({ author: parent.id }),
  },
  Post: {
    author: (parent) => User.findById(parent.author),
  },
};
```

---

### 🚀 8. Apollo Server Setup

`src/index.js`:

```js
require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");
const connectDB = require("./utils/db");

const startServer = async () => {
  await connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: () => ({}) // For future auth/db helpers
  });

  server.listen({ port: 4000 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
};

startServer();
```

---

## 🏛️ PART 2: PostgreSQL + Prisma

---

### ✅ 1. Setup

```bash
pnpm init -y
pnpm add apollo-server graphql @prisma/client dotenv
pnpm add -D prisma
npx prisma init
```

---

### 🗃 2. Prisma Schema

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id     Int    @id @default(autoincrement())
  name   String
  email  String
  posts  Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String
  author   User   @relation(fields: [authorId], references: [id])
  authorId Int
}
```

---

### 🌱 3. .env

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/graphql_db"
```

Run:

```bash
npx prisma migrate dev --name init
```

---

### 📦 4. Generate Client

```bash
npx prisma generate
```

---

### 🧠 5. Schema + Resolvers

Same as in MongoDB. Just change resolver logic to use Prisma client.

---

### 🧠 6. Resolvers (Prisma)

`src/schema/resolvers.js`:

```js
module.exports = {
  Query: {
    getUsers: (_, __, { prisma }) => prisma.user.findMany({ include: { posts: true } }),
    getPosts: (_, __, { prisma }) => prisma.post.findMany({ include: { author: true } }),
  },
  Mutation: {
    addUser: (_, { name, email }, { prisma }) =>
      prisma.user.create({ data: { name, email } }),
    addPost: (_, { title, content, authorId }, { prisma }) =>
      prisma.post.create({
        data: { title, content, author: { connect: { id: Number(authorId) } } },
      }),
  },
  User: {
    posts: (parent, _, { prisma }) =>
      prisma.post.findMany({ where: { authorId: parent.id } }),
  },
  Post: {
    author: (parent, _, { prisma }) =>
      prisma.user.findUnique({ where: { id: parent.authorId } }),
  },
};
```

---

### 🚀 7. Apollo Server with Prisma Context

`src/index.js`:

```js
require("dotenv").config();
const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ prisma })
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
```

---

## 🎯 Summary — Mongo vs Prisma

| Feature             | MongoDB (Mongoose)               | PostgreSQL (Prisma)            |
| ------------------- | -------------------------------- | ------------------------------ |
| Data modeling       | JS schemas                       | Prisma schema                  |
| Relational querying | Populate or manual refs          | Built-in relations             |
| Context             | Not needed here, useful for auth | Used to pass `prisma` client   |
| Ideal for           | Rapid prototyping                | Structured enterprise backends |

---


# 🔐 PHASE 4: Authentication & Authorization

---

Great, Sri — let’s build **🔐 Phase 4: Auth + Authorization** using `apollo-server` (not `apollo-server-express`) + `express`, and JWT for secure APIs.

> ✅ This is **production-ready**: clean context, secure token validation, role-based access, and GraphQL on `/graphql`.

---

## 🔧 Tech Stack

* `apollo-server` (for GraphQL)
* `express` (for routing)
* `jsonwebtoken` (for auth)
* `bcryptjs` (for password hashing)
* `dotenv`
* DB: You can use either **Mongo (Mongoose)** or **PostgreSQL (Prisma)** from earlier setup — this example will be generic with examples for both.

---

## 📦 Install Dependencies

```bash
pnpm add apollo-server express jsonwebtoken bcryptjs dotenv
```

---

## 📁 File Structure

```
/src
  index.js             # Express + Apollo init
  auth.js              # JWT logic
  /schema
    typeDefs.js
    resolvers.js
  /models or prisma    # Based on your DB
.env
```

---

## 🔑 .env

```env
JWT_SECRET=my_super_secret
PORT=4000
```

---

## 🔐 JWT Helper

`src/auth.js`:

```js
const jwt = require("jsonwebtoken");

const getUserFromToken = (req) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
};

module.exports = { getUserFromToken };
```

---

## 📜 GraphQL TypeDefs

`src/schema/typeDefs.js`:

```js
const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getUsers: [User!]!
    getPosts: [Post!]!
    me: User
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addPost(title: String!, content: String!): Post!
    deleteUser(userId: ID!): Boolean!
  }
`;
```

---

## 🧠 Resolvers with Auth

`src/schema/resolvers.js` (Generic):

```js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  Query: {
    getUsers: (_, __, { db }) => db.user.findMany({ include: { posts: true } }),
    getPosts: (_, __, { db }) => db.post.findMany({ include: { author: true } }),
    me: (_, __, { user }) => user,
  },
  Mutation: {
    signup: async (_, { name, email, password }, { db }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await db.user.create({
        data: { name, email, password: hashedPassword, role: "USER" },
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET
      );

      return { token, user };
    },
    login: async (_, { email, password }, { db }) => {
      const user = await db.user.findUnique({ where: { email } });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET
      );

      return { token, user };
    },
    addPost: async (_, { title, content }, { user, db }) => {
      if (!user) throw new Error("Not authenticated");

      return db.post.create({
        data: {
          title,
          content,
          author: { connect: { id: user.id } },
        },
      });
    },
    deleteUser: async (_, { userId }, { user, db }) => {
      if (!user || user.role !== "ADMIN")
        throw new Error("Not authorized");

      await db.user.delete({ where: { id: Number(userId) } });
      return true;
    },
  },
  User: {
    posts: (parent, _, { db }) =>
      db.post.findMany({ where: { authorId: parent.id } }),
  },
  Post: {
    author: (parent, _, { db }) =>
      db.user.findUnique({ where: { id: parent.authorId } }),
  },
};
```

> ⚙ Replace `db` with `prisma` or `mongoose` based logic depending on your DB setup.

---

## 🌐 Express + Apollo Setup on `/graphql`

`src/index.js`:

```js
require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");
const { getUserFromToken } = require("./auth");

// Example: Prisma DB (can replace with Mongoose)
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const user = getUserFromToken(req);
      return { user, db }; // Inject user and DB into context
    },
  });

  await server.start();

  app.use("/graphql", (req, res) => {
    return server.createHandler({ path: "/graphql" })(req, res);
  });

  app.listen(process.env.PORT, () => {
    console.log(`🚀 GraphQL running at http://localhost:${process.env.PORT}/graphql`);
  });
};

startServer();
```

---

## 🧪 Example JWT Flow

1. Call `signup` or `login` → receive a `token`
2. Pass `Authorization: Bearer <token>` in headers
3. Token is decoded and added to `context.user`
4. Role-based checks done in resolvers

---

# ⚙️ PHASE 5: Advanced GraphQL Features

---

Let’s dive into **Phase 5: Advanced GraphQL Features**! We will cover **GraphQL Fragments**, **Variables in queries**, **Custom Scalars**, and more, using **MongoDB + Mongoose**.


Let’s pause the code and walk through each advanced concept in **plain English**, with mini‑examples (not full apps), so you get the theory and “why” before diving back into code.

---

## 1. GraphQL Fragments

**What it is:**
A **fragment** is a reusable piece of a query. Instead of repeating the same fields in multiple queries, you define them once and “spread” them where needed.

**Why use it:**

* **DRY** (Don’t Repeat Yourself).
* Makes queries easier to maintain.

**Mini‑example:**

```graphql
# Define once
fragment UserFields on User {
  id
  name
  email
}

# Use it in many places
query GetAllUsers {
  getUsers {
    ...UserFields
  }
}

query GetCurrentUser {
  me {
    ...UserFields
  }
}
```

---

## 2. Variables in Queries

**What it is:**
Instead of hard‑coding values, you declare **variables** at the top of the query and pass them in. This makes your queries dynamic.

**Why use it:**

* Reuse the same query with different inputs.
* Keeps your client code clean.

**Mini‑example:**

```graphql
# 1) Declare your variable ($id is ID type)
query GetUserById($id: ID!) {
  user(id: $id) {
    name
    email
  }
}

# 2) Supply the variable at execution:
#    { "id": "123" }
```

---

## 3. Input Types

**What it is:**
GraphQL’s way to accept **complex, structured** data into mutations (or queries). An `input` type defines a nested object you can pass.

**Why use it:**

* Group related fields (e.g., a full user profile)
* Validate server-side that the object shape is correct

**Mini‑example:**

```graphql
# Define an input with several fields
input UpdateProfileInput {
  name: String
  email: String
}

# Use it in a mutation
mutation UpdateMyProfile($data: UpdateProfileInput!) {
  updateProfile(input: $data) {
    id
    name
    email
  }
}

# Variables payload:
# {
#   "data": { "name": "New Name", "email": "new@example.com" }
# }
```

---

## 4. Custom Scalars

**What it is:**
Beyond the built‑in types (`String`, `Int`, etc.), you can define your own **scalar** (atomic) types—like `Date` or `Upload`—and teach GraphQL how to parse/serialize them.

**Why use it:**

* Enforce specific formats (e.g., ISO date strings)
* Handle file streams (`Upload`)

**Mini‑example:**

```graphql
# Schema
scalar Date

type Event {
  id: ID!
  date: Date!
}

# Behind the scenes, you map Date → JavaScript Date in your resolvers
```

---

## 5. Enum Types

**What it is:**
An **enum** is a field that can only be one of a fixed set of values.

**Why use it:**

* Strongly type fields with limited choices (e.g., user roles, status codes).

**Mini‑example:**

```graphql
enum Role {
  USER
  ADMIN
}

type User {
  id: ID!
  role: Role!
}

# You can only ever set `role` to USER or ADMIN.
```

---

## 6. Union & Interface Types

### Interface

* Think: **“These types share some fields.”**
* You define an interface, then object types that “implement” it must contain those fields.

**Mini‑example:**

```graphql
interface Node {
  id: ID!
}

type User implements Node {
  id: ID!
  name: String!
}

type Post implements Node {
  id: ID!
  title: String!
}

# Query that returns “Node” can return either type.
union SearchResult = User | Post
```

### Union

* Think: **“This field may be one of several distinct types.”**
* You don’t force common fields—just say “this could be A or B or C.”

**Mini‑example:**

```graphql
union SearchResult = Photo | Person

type Photo { url: String! }
type Person { name: String! }
```

---

## 7. Apollo Server Lifecycle

Apollo provides hooks at various stages of a request’s life:

1. **`context`**

   * Runs **before** resolvers.
   * You inject shared objects (e.g., current user, DB handles).
2. **`formatError`**

   * Intercepts errors **after** they happen in resolvers.
   * You can mask or reformat messages.
3. **`plugins`**

   * Tap into low‑level events (startup, request start/end, schema building).
   * Useful for logging, tracing, metrics.

**Why it matters:**

* Lets you add auth, monitoring, and global logic **outside** of every single resolver.

---

## 8. File Upload via GraphQL

**What it is:**
Using the \[GraphQL Multipart Request Spec], you can send files in a mutation via a special `Upload` scalar.

**Flow:**

1. Client sends a **multipart/form-data** POST.
2. The `Upload` scalar gives you a **stream** in your resolver.
3. You read that stream, save the file (e.g., to S3 or disk), then return a URL or metadata.

**Mini‑example:**

```graphql
scalar Upload

type Mutation {
  uploadProfilePic(file: Upload!): String!  # returns URL
}

# In resolver, handle the incoming stream
```

---

### 🧩 Putting It All Together

On the **client side**, you might write:

```graphql
mutation UpdateProfile($data: UpdateProfileInput!, $file: Upload!) {
  updateProfile(input: $data, picture: $file) {
    ...UserFields
  }
}

fragment UserFields on User {
  id
  name
  profilePicture
}
```

And supply:

* Variables JSON for `data`
* A `file` in the multipart form

---

Here’s a complete, hands-on example to guide you through all the advanced GraphQL capabilities. We’ll also integrate file upload functionality using `graphql-upload`.

---

### 📦 Install Dependencies

First, let’s make sure we have all the necessary dependencies:

```bash
pnpm add apollo-server graphql mongoose jsonwebtoken bcryptjs graphql-upload dotenv
```

---

### 🗂 File Structure

We’ll maintain a clean project structure as before:

```
/src
  /schema
    typeDefs.js
    resolvers.js
  /models
    user.js
    post.js
  auth.js
  index.js
.env
```

---

### 🌍 .env

```env
JWT_SECRET=my_super_secret
PORT=4000
MONGO_URI=mongodb://localhost:27017/graphql_example
```

---

### 💾 MongoDB Models

`src/models/user.js`

```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  profilePicture: { type: String },  // to store file URL
});

module.exports = mongoose.model("User", userSchema);
```

`src/models/post.js`

```js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model("Post", postSchema);
```

---

### ⚙️ GraphQL Schema (Advanced)

We will use **Fragments**, **Enums**, and **Input Types**.

`src/schema/typeDefs.js`

```js
const { gql } = require("apollo-server");

module.exports = gql`
  scalar Date
  scalar Upload

  enum Role {
    USER
    ADMIN
  }

  input UpdateProfileInput {
    name: String
    email: String
    profilePicture: Upload
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    profilePicture: String
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getUsers: [User!]!
    getPosts: [Post!]!
    me: User
  }

  type Mutation {
    signup(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateProfile(input: UpdateProfileInput!): User
    addPost(title: String!, content: String!): Post!
    deleteUser(userId: ID!): Boolean!
  }
`;
```

---

### 🧠 Resolvers (Including Advanced Features)

In the resolvers, we will handle **Enums**, **Input Types**, and **File Upload**.

`src/schema/resolvers.js`

```js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { GraphQLUpload } = require("graphql-upload");
const User = require("../models/user");
const Post = require("../models/post");

module.exports = {
  Upload: GraphQLUpload,  // Required for file upload

  Query: {
    getUsers: () => User.find(),
    getPosts: () => Post.find().populate("author"),
    me: (_, __, { user }) => user,  // Get currently authenticated user
  },

  Mutation: {
    signup: async (_, { name, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        role: "USER",
      });

      await user.save();

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET
      );

      return { token, user };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET
      );

      return { token, user };
    },

    updateProfile: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      let updatedUser = { ...input };
      
      if (input.profilePicture) {
        // Handle file upload
        updatedUser.profilePicture = "some_file_url";
      }

      await User.findByIdAndUpdate(user.id, updatedUser, { new: true });

      return User.findById(user.id);
    },

    addPost: async (_, { title, content }, { user }) => {
      if (!user) throw new Error("Not authenticated");

      const post = new Post({
        title,
        content,
        author: user.id,
      });

      return post.save();
    },

    deleteUser: async (_, { userId }, { user }) => {
      if (!user || user.role !== "ADMIN")
        throw new Error("Not authorized");

      await User.findByIdAndDelete(userId);
      return true;
    },
  },

  User: {
    posts: (parent) => Post.find({ author: parent.id }),
  },

  Post: {
    author: (parent) => User.findById(parent.author),
  },
};
```

---

### 🚀 Express + Apollo Server with File Upload

Now, let’s set up the server with Apollo Server (using `graphql-upload` for file uploads).

`src/index.js`

```js
require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const { ApolloServerPluginLandingPageGraphQLPlayground } = require("apollo-server-core");
const { getUserFromToken } = require("./auth");
const { GraphQLUpload } = require("graphql-upload");

const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: {
    maxFileSize: 10000000,  // Limit to 10MB
    maxFiles: 5,
  },
  context: ({ req }) => {
    const user = getUserFromToken(req);
    return { user };
  },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.start().then(() => {
  app.use("/graphql", server.createHandler());
  app.listen(process.env.PORT, () =>
    console.log(`🚀 GraphQL server running at http://localhost:${process.env.PORT}/graphql`)
  );
});
```

---

### 💡 Key Features

* **File Upload**: Using `graphql-upload`, we handle file uploads in the `updateProfile` mutation. You will typically store the file on a cloud storage (e.g., S3, Cloudinary) and save the URL in the MongoDB `profilePicture` field.
* **Input Types**: Complex inputs like `UpdateProfileInput` allow us to handle structured data.
* **Enums**: We use the `Role` enum to define possible user roles (USER, ADMIN).
* **Fragments**: You can use GraphQL fragments on the client to reuse field selections across queries. Example:

```graphql
fragment UserFields on User {
  id
  name
  email
}

query {
  getUsers {
    ...UserFields
  }
}
```

---

### 🧪 Testing with Playground

1. **Signup**:

   * Call `signup(name, email, password)` to create a user and get a JWT.

2. **Login**:

   * Call `login(email, password)` to authenticate and get a JWT.

3. **Update Profile**:

   * Use `updateProfile(input: {name, email, profilePicture})` to change profile details. For `profilePicture`, use `graphql-upload` to upload a file.

4. **File Upload**: In `updateProfile`, you can upload a file (e.g., profile picture). This will typically return a URL where the image is hosted.

---

# 📡 PHASE 6: Subscriptions (Real-Time)

In this phase, we are adding **real-time** capabilities to your GraphQL API using **subscriptions**. With subscriptions, clients can listen for updates from the server in real time, making your app interactive and engaging (think live chat, notifications, or real-time dashboards).

---

## 1. **What are Subscriptions?**

**Definition:**
A **GraphQL Subscription** allows a client to **subscribe** to specific events on the server and **receive updates** in real time whenever that event occurs. Think of it like a **push notification** system for your data.

**Difference from Queries and Mutations:**

* **Queries** fetch data (like a GET request).
* **Mutations** change data (like a POST request).
* **Subscriptions** listen to data changes and push updates to the client (like a WebSocket or long-polling).

**Use Cases:**

* Real-time chat messages.
* Stock prices updating live.
* New comments or posts being added in a feed.

---

## 2. **Setup Apollo with WebSocket (`graphql-ws`)**

We’ll use `graphql-ws`, which is a WebSocket protocol for GraphQL, for managing real-time subscriptions.

### Steps:

### **Install Dependencies:**

```bash
pnpm add apollo-server graphql graphql-ws express
```

### **Server Setup:**

```js
import express from 'express';
import { ApolloServer } from 'apollo-server';
import { PubSub } from 'graphql-subscriptions';
import { useServer } from 'graphql-ws/lib/use/ws';
import WebSocket from 'ws';

// Initialize Express app
const app = express();

// Initialize Apollo Server
const pubsub = new PubSub();

// Define the type definitions for GraphQL
const typeDefs = `
  type Post {
    id: ID!
    title: String!
    content: String!
  }

  type Query {
    posts: [Post]
  }

  type Mutation {
    addPost(title: String!, content: String!): Post
  }

  type Subscription {
    postAdded: Post
  }
`;

// Define resolvers for Query, Mutation, and Subscription
const resolvers = {
  Query: {
    posts: () => posts,
  },
  Mutation: {
    addPost: (parent, { title, content }) => {
      const newPost = { id: Date.now().toString(), title, content };
      posts.push(newPost);

      // Trigger the postAdded subscription
      pubsub.publish('POST_ADDED', { postAdded: newPost });

      return newPost;
    },
  },
  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator(['POST_ADDED']),
    },
  },
};

// Initialize the Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    // Pass any context (e.g., user info) here
  }),
  subscriptions: {
    path: '/graphql',  // This is where subscriptions will be handled
  },
});

// Start Apollo Server
server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
```

### Explanation of the Server Code:

* **Apollo Server**: We set up Apollo Server like usual, but this time we add a `subscriptions` option to handle subscriptions over WebSocket.
* **`graphql-ws`**: This package allows us to support the WebSocket protocol for real-time subscriptions.
* **PubSub**: The `PubSub` class is used to simulate a Pub/Sub (Publish/Subscribe) pattern. It's a mechanism where:

  * **Publish**: When a new post is created via `addPost`, we call `pubsub.publish()` to notify subscribers.
  * **Subscribe**: The subscription `postAdded` listens for the event of a new post being added.

---

## 3. **PubSub System for Local Events**

PubSub is a simple in-memory message bus. It allows us to “publish” events and “subscribe” to them.

**How it works:**

* **Publish:** When a new post is created, we "publish" a message under the event name `'POST_ADDED'`.
* **Subscribe:** The client can “subscribe” to this event and get a real-time push of the new post.

---

## 4. **Basic `onPostAdded` Subscription**

The `onPostAdded` subscription will allow clients to listen for new posts in real-time. Here's the core of it:

1. **On the server-side**:

   * We define a `postAdded` subscription.
   * When a post is added via a mutation, we trigger the subscription event using `pubsub.publish('POST_ADDED')`.

```graphql
# Subscription definition in typeDefs
type Subscription {
  postAdded: Post
}
```

2. **On the client-side** (using Apollo Client or Apollo Studio):

   * You can now listen to the `postAdded` event.
   * Every time a new post is added, the client will receive the latest post in real-time.

---

### **Example Mutation and Subscription:**

```graphql
# Mutation to create a new post
mutation addPost($title: String!, $content: String!) {
  addPost(title: $title, content: $content) {
    id
    title
    content
  }
}

# Subscription to listen for new posts
subscription onPostAdded {
  postAdded {
    id
    title
    content
  }
}
```

---

### Testing Subscriptions in Apollo Studio or Playground:

1. **Mutation**: Use the mutation to add a post. This will trigger the `postAdded` subscription.
2. **Subscription**: Once you run the subscription query, it will stay open and wait for new data (new posts). Every time you add a post via the mutation, the subscription will return the latest post.

---

## 5. **Client-Side Code to Handle Subscriptions**

If you're using Apollo Client in your frontend, the subscription part is handled using **`ApolloClient`** and **`WebSocketLink`**:

```js
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';

// Create WebSocketLink for subscriptions
const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/graphql`,
  options: {
    reconnect: true,  // Reconnect automatically if the connection drops
  },
});

// Create Apollo Client with WebSocket Link
const client = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache(),
});

// Subscribe to new posts
client.subscribe({
  query: gql`
    subscription {
      postAdded {
        id
        title
        content
      }
    }
  `
}).subscribe({
  next(data) {
    console.log('New post added:', data);
  }
});
```

---

## Key Points to Remember

1. **WebSocket**: Subscriptions use WebSockets, allowing the server to push data to the client.
2. **PubSub**: A lightweight local event system, used here to simulate pushing new data from the server to all subscribed clients.
3. **Live Testing**: Use Apollo Studio or Playground to test subscriptions. They provide an interactive way to simulate live updates.

---

### Next Steps

* Add more complex subscription events like chat messages or notifications.
* Explore how to persist real-time events (e.g., saving a post to a database) and update clients accordingly.

---

# 🏗️ PHASE 7: Production Readiness

---

In this phase, we’ll cover how to make your GraphQL server production-ready by implementing best practices, optimizing performance, and setting up tools that help you manage your GraphQL API at scale. This includes caching, rate limiting, depth limiting, error handling, monitoring, and setting up CI/CD pipelines and Docker.

---

### ✅ Topics Breakdown:

1. **Schema Stitching / Federation Basics**
2. **Caching**
3. **Rate Limiting**
4. **Depth Limiting**
5. **Performance Monitoring (Apollo Studio / Tracing)**
6. **Schema Validation and Testing**
7. **Error Handling Best Practices**
8. **CI/CD with GitHub Actions**
9. **Dockerize the GraphQL Server**

---

### 1. **Schema Stitching / Federation Basics**

**Theory:**

* **Schema Stitching** and **Federation** are techniques to combine multiple GraphQL schemas into one. If you have different services (microservices), each with its own GraphQL API, you can stitch them together or federate them to create a unified schema.
* **Schema Stitching**: Allows you to merge multiple schemas from different services.
* **GraphQL Federation**: A modern approach, usually using Apollo Federation, to divide the GraphQL schema into multiple subgraphs (services). Each subgraph has its own schema, and Apollo Gateway unites them into one schema.

**Example (Schema Stitching)**:
We can merge two schemas (`User` and `Post`) into one.

```js
import { mergeSchemas } from '@graphql-tools/merge';
import { makeExecutableSchema } from '@graphql-tools/schema';

const userSchema = makeExecutableSchema({
  typeDefs: `
    type User {
      id: ID!
      name: String!
    }
    type Query {
      users: [User]
    }
  `,
  resolvers: {
    Query: {
      users: () => [{ id: '1', name: 'John Doe' }],
    },
  },
});

const postSchema = makeExecutableSchema({
  typeDefs: `
    type Post {
      id: ID!
      title: String!
      authorId: ID!
    }
    type Query {
      posts: [Post]
    }
  `,
  resolvers: {
    Query: {
      posts: () => [{ id: '1', title: 'My First Post', authorId: '1' }],
    },
  },
});

// Stitch the schemas together
const schema = mergeSchemas({
  schemas: [userSchema, postSchema],
});
```

---

### 2. **Caching**

**Theory:**

* **Caching** stores the results of frequent queries so that the server doesn't need to compute the result each time. It significantly speeds up responses.
* **Apollo Server** supports caching with the help of cache control headers.

**Example (Basic Caching):**
Add caching headers for GraphQL queries:

```js
import { ApolloServer, gql } from 'apollo-server';
import { ApolloServerPluginCacheControl } from 'apollo-server-core';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginCacheControl({
      defaultMaxAge: 5, // Cache responses for 5 seconds
      calculateHttpHeaders: true, // Include caching headers in HTTP response
    }),
  ],
});
```

This will instruct Apollo Server to cache query results for 5 seconds.

---

### 3. **Rate Limiting**

**Theory:**

* **Rate Limiting** prevents abuse by restricting the number of requests a client can make within a specific time frame. This is useful to avoid excessive requests from a single user or bot.

**Example (Rate Limiting):**
Use the `express-rate-limit` package to limit the number of requests to your API:

```bash
pnpm add express-rate-limit
```

In the server setup:

```js
import rateLimit from 'express-rate-limit';
import express from 'express';

const app = express();

// Set rate limit to 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

---

### 4. **Depth Limiting**

**Theory:**

* **Depth Limiting** restricts the depth of queries to prevent deeply nested queries, which can be resource-intensive and vulnerable to DoS attacks.

**Example (GraphQL Depth Limit):**
Use the `graphql-depth-limit` package to limit query depth:

```bash
pnpm add graphql-depth-limit
```

Then, in your Apollo Server setup:

```js
import depthLimit from 'graphql-depth-limit';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5)], // Max depth of 5 for queries
});
```

---

### 5. **Performance Monitoring (Apollo Studio / Tracing)**

**Theory:**

* **Performance Monitoring** allows you to track how well your API is performing, identify slow queries, and optimize them.
* **Apollo Studio** and **Apollo Tracing** help monitor API performance by collecting metrics like response time, resolver performance, and error rates.

**Example (Apollo Tracing):**
To enable tracing in Apollo Server:

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    {
      requestDidStart() {
        return {
          didResolveOperation({ request, document }) {
            console.log('Request received');
          },
        };
      },
    },
  ],
});
```

You can also connect Apollo Server to **Apollo Studio** to visualize and analyze your API’s performance.

---

### 6. **Schema Validation and Testing**

**Theory:**

* **Schema Validation** ensures that your GraphQL schema is consistent and correct. You should validate your schema to avoid runtime errors.
* **Schema Testing** helps ensure that all parts of your API work as expected by writing unit tests.

**Example (Schema Testing)**:
You can use **Jest** and **supertest** to write tests for your GraphQL schema:

```bash
pnpm add jest supertest
```

Example of a simple test:

```js
import request from 'supertest';
import { server } from './server';

describe('GraphQL Tests', () => {
  it('fetches users', async () => {
    const response = await request(server)
      .post('/graphql')
      .send({
        query: `{ users { id name } }`,
      });
    expect(response.body.data.users).toBeDefined();
  });
});
```

---

### 7. **Error Handling Best Practices**

**Theory:**

* **Error Handling** in GraphQL should provide detailed error messages without exposing sensitive information (like stack traces). Use custom error handling mechanisms to catch issues.
* GraphQL allows you to return **error messages** along with your response.

**Example:**
You can define a custom error handler using Apollo Server’s `formatError` option:

```js
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    // Don't expose sensitive information in production
    if (process.env.NODE_ENV === 'production') {
      return new Error('Internal server error');
    }
    return err;
  },
});
```

---

### 8. **CI/CD with GitHub Actions**

**Theory:**

* **CI/CD** automates testing and deployment. In this step, you will use GitHub Actions to run tests, lint your code, and deploy your GraphQL server automatically whenever you push changes.

**Example (GitHub Action):**

```yaml
name: GraphQL CI/CD Pipeline

on:
  push:
    branches:
      - main

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: pnpm install
      - name: Run linter
        run: pnpm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: pnpm install
      - name: Run tests
        run: pnpm test
```

---

### 9. **Dockerize the GraphQL Server**

**Theory:**

* **Dockerizing** your GraphQL server means packaging it with all its dependencies in a Docker container, ensuring that it runs the same way in any environment.

**Example (Dockerfile):**

Create a `.dockerfile`:

```Dockerfile
# Use official Node.js image as base
FROM node:16

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json .
COPY pnpm-lock.yaml .
RUN pnpm install

# Copy the source code
COPY . .

# Expose port for the app
EXPOSE 4000

# Start the app
CMD ["pnpm", "start"]
```

**docker-compose.yml** to run it:

```yaml
version: '3'
services:
  graphql-server:
    build: .
    ports:
      - "4000:4000"
    environment:
      NODE_ENV: production
```

---

### ✅ Summary of Best Practices:

* **Schema Stitching/Federation**: Combine multiple schemas into a unified one.
* **Caching**: Use cache control headers to speed up responses.
* **Rate Limiting**: Limit the number of requests a client can make.
* **Depth Limiting**: Prevent deeply nested queries to avoid resource exhaustion.
* **Performance Monitoring**: Use Apollo Studio for real-time API metrics.
* **Schema Validation**: Ensure that your GraphQL schema is valid and tested.
* **Error Handling**: Provide detailed errors, but hide sensitive information in production.
* **CI/CD**: Automate your development pipeline with GitHub Actions.
* **Docker**: Package your server in a Docker container for consistent deployment.

This completes the production-readiness phase for your GraphQL server. Let me know if you'd like any of these topics to be explained further!

---

# 🧠 PHASE 8: Mastery Through Project

---

In this phase, we will build a full-stack project called **DevConnect**, a social platform for developers. DevConnect will allow developers to sign up, write posts, follow each other, and receive real-time notifications on activities like new posts or follows.

We’ll focus on creating a **production-grade** project with advanced features using technologies such as **Apollo Server**, **Express**, **MongoDB/Postgres**, **React**, **Apollo Client**, **TailwindCSS**, **JWT authentication**, **Role-based access control**, and deployment to **Render**, **Heroku**, **Vercel**, or **Railway**.

---

### 📦 **Project Stack:**

1. **Backend**: Apollo Server, Express, MongoDB/Postgres
2. **Frontend**: React, Apollo Client, TailwindCSS
3. **Authentication**: JWT, Role-based access control
4. **Deployment**:

   * Frontend: Vercel or Render (for React)
   * Backend: Railway (for Apollo Server with Express)

---

### 🚀 **Step-by-Step Guide for DevConnect**

#### **1. Backend Setup** – **Apollo Server + Express + MongoDB/PostgreSQL**

1. **Initialize the project**:

   * Create a new project folder and initialize Node.js.

   ```bash
   mkdir devconnect-backend
   cd devconnect-backend
   npm init -y
   ```

2. **Install dependencies**:

   ```bash
   npm install express apollo-server graphql mongoose jsonwebtoken bcryptjs cors dotenv
   npm install --save-dev nodemon
   ```

   * **Express**: Used for setting up the HTTP server.
   * **Apollo Server**: Used to handle GraphQL queries and mutations.
   * **Mongoose**: For MongoDB (or Prisma for PostgreSQL).
   * **jsonwebtoken & bcryptjs**: For JWT authentication and password hashing.
   * **dotenv**: To manage environment variables.

3. **Setup Express & Apollo Server**:

   Create a `server.js` file:

   ```js
   const express = require('express');
   const { ApolloServer, gql } = require('apollo-server-express');
   const mongoose = require('mongoose');
   const dotenv = require('dotenv');
   dotenv.config();

   const app = express();

   // Connect to MongoDB
   mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
     .then(() => console.log('Connected to MongoDB'))
     .catch(err => console.log(err));

   // Define GraphQL Schema
   const typeDefs = gql`
     type User {
       id: ID!
       username: String!
       email: String!
     }

     type Post {
       id: ID!
       title: String!
       content: String!
       author: User!
     }

     type Query {
       users: [User]
       posts: [Post]
     }

     type Mutation {
       createUser(username: String!, email: String!, password: String!): User
       createPost(title: String!, content: String!): Post
     }
   `;

   const resolvers = {
     Query: {
       users: () => User.find(),
       posts: () => Post.find(),
     },
     Mutation: {
       createUser: async (_, { username, email, password }) => {
         const hashedPassword = await bcrypt.hash(password, 10);
         const newUser = new User({ username, email, password: hashedPassword });
         await newUser.save();
         return newUser;
       },
       createPost: (_, { title, content }, context) => {
         if (!context.user) throw new Error('Unauthorized');
         const newPost = new Post({ title, content, author: context.user.id });
         newPost.save();
         return newPost;
       },
     },
   };

   const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ user: req.user }) });

   // Apply Middleware to Express
   server.applyMiddleware({ app });

   // Start Express server
   app.listen({ port: process.env.PORT || 4000 }, () =>
     console.log(`Server running at http://localhost:4000${server.graphqlPath}`)
   );
   ```

   This is the basic setup for Apollo Server with Express and MongoDB (you can change it to PostgreSQL with Prisma if needed).

4. **JWT Authentication Setup**:

   Create a middleware to authenticate users based on JWT:

   ```js
   const jwt = require('jsonwebtoken');

   const authenticate = (req, res, next) => {
     const token = req.header('Authorization')?.replace('Bearer ', '');
     if (!token) return res.status(401).send('Access Denied');

     try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded;
       next();
     } catch (err) {
       return res.status(401).send('Invalid Token');
     }
   };
   ```

---

#### **2. Frontend Setup** – **React + Apollo Client + TailwindCSS**

1. **Create React App**:

   ```bash
   npx create-react-app devconnect-frontend
   cd devconnect-frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install @apollo/client graphql tailwindcss
   ```

3. **Set up Apollo Client**:

   In `src/apolloClient.js`:

   ```js
   import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

   const httpLink = createHttpLink({
     uri: 'http://localhost:4000/graphql', // Backend URL
   });

   const client = new ApolloClient({
     link: httpLink,
     cache: new InMemoryCache(),
   });

   export default client;
   ```

4. **Set up TailwindCSS**:

   Follow the [TailwindCSS setup guide](https://tailwindcss.com/docs/installation) to install and configure Tailwind in your React project.

5. **Create Pages & Components**:

   Example of a simple login component:

   ```js
   import { useState } from 'react';
   import { useMutation } from '@apollo/client';
   import { LOGIN_USER } from './queries';

   const Login = () => {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');

     const [loginUser] = useMutation(LOGIN_USER);

     const handleSubmit = (e) => {
       e.preventDefault();
       loginUser({ variables: { email, password } })
         .then((res) => {
           localStorage.setItem('token', res.data.login.token);
         })
         .catch((err) => console.log(err));
     };

     return (
       <form onSubmit={handleSubmit}>
         <input type="email" onChange={(e) => setEmail(e.target.value)} />
         <input type="password" onChange={(e) => setPassword(e.target.value)} />
         <button type="submit">Login</button>
       </form>
     );
   };

   export default Login;
   ```

   The above component allows users to log in by sending a request to the backend. The backend will send a JWT token, which is then stored locally.

---

#### **3. Real-time Notifications** – **WebSockets with Apollo Subscriptions**

1. **Backend Setup for Subscriptions**:

   You will need to modify your Apollo Server to support WebSocket connections for subscriptions.

   Install `graphql-ws`:

   ```bash
   npm install graphql-ws
   ```

   Then, modify the `server.js` to support subscriptions:

   ```js
   const { useServer } = require('graphql-ws');
   const { WebSocketServer } = require('ws');

   const wsServer = new WebSocketServer({
     server: app.listen(4000),
     path: '/graphql',
   });

   useServer({ schema, onConnect: () => console.log('Client connected') }, wsServer);
   ```

2. **Frontend Setup for Subscriptions**:

   In the frontend, use Apollo Client’s `useSubscription` hook to listen for new posts or follow events.

   ```js
   import { useSubscription } from '@apollo/client';
   import { NEW_POST_ADDED } from './queries';

   const NewPosts = () => {
     const { data, loading } = useSubscription(NEW_POST_ADDED);

     if (loading) return <div>Loading...</div>;

     return (
       <div>
         {data.newPostAdded.title}
       </div>
     );
   };

   export default NewPosts;
   ```

   This component listens for new posts in real-time using WebSockets.

---

### 🔐 **Authentication and Authorization**

* **JWT Authentication**: Use JWT for signing up, logging in, and protecting routes.
* **Role-based Access Control**: Implement role-based permissions to restrict access to certain features (e.g., admin-only routes).

---

### 🚀 **Deployment**

1. **Frontend Deployment (Vercel/Render)**:

   * Follow the documentation on Vercel or Render to deploy your React app.
   * Ensure you link your GitHub repo for automatic deployments on push.

2. **Backend Deployment (Railway/Heroku)**:

   * Deploy your Apollo Server + Express app on Railway or Heroku. Configure environment variables for MongoDB URI, JWT secret, and any other necessary configurations.

---

### ✅ **Key Features to Implement**:

* **User authentication with JWT**: Signup, login, and session management.
* **Posts CRUD**: Create, read, update, and delete posts.
* **Followers**: Users can follow/unfollow each other.
* **Real-time notifications**: Using subscriptions to notify users of new posts or follows.
* **Role-based access control**: Protect certain routes based on user roles (e.g., admin).

---

This project is a **comprehensive** and **production-grade** application that covers key concepts in **full-stack development** using **Apollo Server**, **Express**, **React**, and **Apollo Client**. It provides a lot of room for advanced features such as **real-time notifications**, **role-based authentication**, and **optimized GraphQL queries**.

---

THANKS FOR READING!

> # 🌟 LEAVE A STAR IF YOU LIKED IT!