Demo with Apollo Server running with OTEL
=========================================

This repository contains a minimal demo that starts a GraphQL
server using ApolloServer automatically instrumented with OTEL.

## Running the server

The server can be built started with `npm start`. By default it will
send traces to an OTLP compatible HTTP endpoint at `http://localhost:4138`.

## Configure OTEL

To configure an alternate OTEL endpoint or authentication, use the following variables:

- `OTEL_SERVICE_NAME`: Sets the service name, defaults `apollo-server-otel-demo`
- `OTEL_HTTP_ENDPOINT`: Sets the OTEL endpoint, defaults to `http://localhost:4138`
- `OTEL_AUTH_TOKEN`: Uses the token as a bearer token by setting the HTTP Authentication header
