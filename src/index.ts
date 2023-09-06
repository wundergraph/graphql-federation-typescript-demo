// XXX: Put this at the top, telemetry has to be initialized before instrumented
// packages (http, express, graphql, etc...) are loaded
import "./telemetry";

import fs from "fs";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { IncomingMessage } from "http";
import path from "path";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== "production",
});

type Request = {
  body?: {
    query: {};
    operationName?: string;
  };
};

const isIntrospectionQuery = (req: IncomingMessage) => {
  const r = req as unknown as Request;
  return r.body?.operationName === "IntrospectionQuery";
};

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
startStandaloneServer(server, {
  context: async ({ req }) => {
    if (isIntrospectionQuery(req)) {
      console.log("introspection");
    } else {
      console.log("not introspection");
    }
    return {};
  },
  listen: { port: 9001 },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
