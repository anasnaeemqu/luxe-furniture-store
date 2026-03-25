import app from "./app.js";

// ─── SMTP startup check ───────────────────────────────────────────────────────
const smtpVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_TO"] as const;
const missingSmtp = smtpVars.filter((v) => !process.env[v]);
if (missingSmtp.length > 0) {
  console.warn(
    `[Email] ⚠  SMTP not configured — emails will be logged to console only.\n` +
    `         Missing env vars: ${missingSmtp.join(", ")}\n` +
    `         Add them in your hosting provider's environment variables to enable real email delivery.`
  );
}

const port = Number(process.env["PORT"]) || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;
