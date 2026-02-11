import { buildCollabServer } from "./server.js";

const port = Number.parseInt(process.env.PORT ?? "3002", 10);
const host = process.env.HOST ?? "0.0.0.0";

const start = async (): Promise<void> => {
  const app = buildCollabServer();

  try {
    await app.listen({ port, host });
  } catch (error) {
    app.log.error(error);
    process.exitCode = 1;
  }
};

void start();
