GraphQL federation subgraph demo with OTEL and Apollo Server
============================================================

This repository contains a minimal TypeScript demo that starts a GraphQL
server using ApolloServer automatically instrumented with OTEL.

The resulting graphql API can be federated with [Cosmo](https://cosmo.wundergraph.com/)
and produces OTEL traces and spans that be integrated with the Cosmo telemetry.

## Running the server

The server can be built started with `npm start`. By default it will
send traces to an OTLP compatible HTTP endpoint at `http://localhost:4138`.

## Configure OTEL

To configure an alternate OTEL endpoint or authentication, use the following variables:

- `OTEL_SERVICE_NAME`: Sets the service name, defaults `graphql-federation-typescript-demo`
- `OTEL_HTTP_ENDPOINT`: Sets the OTEL endpoint, defaults to `http://localhost:4138`
- `OTEL_AUTH_TOKEN`: Uses the token as a bearer token by setting the HTTP Authentication header
