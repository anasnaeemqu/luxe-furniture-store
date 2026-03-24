import app from "./app";

// ─── SMTP startup check ───────────────────────────────────────────────────────
const smtpVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_TO"] as const;
const missingSmtp = smtpVars.filter((v) => !process.env[v]);
if (missingSmtp.length > 0) {
  console.warn(
    `[Email] ⚠  SMTP not configured — emails will be logged to console only.\n` +
    `         Missing secrets: ${missingSmtp.join(", ")}\n` +
    `         Add them in Replit Secrets to enable real email delivery.`
  );
}

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
