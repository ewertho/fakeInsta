import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { ensureDatabaseSchema } from "./lib/bootstrap.js";

const app = buildApp();

async function start() {
  await ensureDatabaseSchema();

  await app.listen({
    port: env.PORT,
    host: "0.0.0.0",
  });
}

start().catch((error) => {
  app.log.error(error);
  process.exit(1);
});
