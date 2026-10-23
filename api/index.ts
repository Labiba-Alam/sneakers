import "dotenv/config";
import serverless from "serverless-http";
import { app } from "../src/server/app";

// Wrap Express app with serverless-http
const serverlessHandler = serverless(app);

// Export the Express app as a Vercel serverless function handler
export default function handler(req: any, res: any) {
  // Direct Node.js / Vercel Serverless execution
  if (req && res && typeof res.setHeader === "function") {
    return app(req, res);
  }
  // AWS Lambda / serverless event wrapper execution
  return serverlessHandler(req, res);
}

export { app, serverlessHandler };
