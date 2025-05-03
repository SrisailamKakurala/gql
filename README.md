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

# 