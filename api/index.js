// Vercel serverless handler — wraps the Express app
const app = require("../../artifacts/api-server/dist/index.cjs");

// The app is exported as default from index.ts
const handler = app.default || app;

module.exports = handler;
