import { Resource } from "@opentelemetry/resources";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import {
  SimpleSpanProcessor,
  ConsoleSpanExporter,
} from "@opentelemetry/sdk-trace-base";
import {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} from "@opentelemetry/sdk-metrics";
import { ExpressInstrumentation } from "@opentelemetry/instrumentation-express";
import { GraphQLInstrumentation } from "@opentelemetry/instrumentation-graphql";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";

const initOpenTelemetry = () => {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);
  registerInstrumentations({
    instrumentations: [
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
      new GraphQLInstrumentation(),
    ],
  });

  const provider = new NodeTracerProvider({
    resource: Resource.default().merge(
      new Resource({
        "service.name":
          process.env.OTEL_SERVICE_NAME || "apollo-server-otel-demo",
      })
    ),
  });

  const consoleExporter = new ConsoleSpanExporter();
  provider.addSpanProcessor(new SimpleSpanProcessor(consoleExporter));

  // Set OTEL_AUTH_TOKEN to enable authorization with a token
  const otelAuthToken = process.env.OTEL_AUTH_TOKEN;
  const otlpExporterHeaders = otelAuthToken
    ? { Authorization: `Bearer ${otelAuthToken}` }
    : undefined;

  const otlpExporter = new OTLPTraceExporter({
    url: process.env.OTEL_HTTP_ENDPOINT, // If undefined, will default to http://localhost:4138
    headers: otlpExporterHeaders,
  });
  provider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));

  provider.register();

  console.log("OpenTelemetry tracing enabled");
};

initOpenTelemetry();
