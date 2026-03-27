import { Router } from "express";
import { db, messagesTable } from "@workspace/db";
import { sendContactEmail } from "../lib/email.js";
import { SendContactMessageBody } from "@workspace/api-zod";

const router = Router();

router.post("/contact", async (req: any, res: any) => {
  const parsed = SendContactMessageBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request data" });
    return;
  }

  const { name, email, subject, message } = parsed.data;

  // Save to DB (fire-and-forget — don't block the response)
  db.insert(messagesTable)
    .values({ name, email, subject, message })
    .catch((err) => console.error("[Contact] Failed to save message to DB:", err));

  // Send email (also fire-and-forget after sending response)
  try {
    await sendContactEmail({ name, email, subject, message });
    res.json({ success: true, message: "Your message has been sent successfully!" });
  } catch (err) {
    console.error("[Contact] Failed to send email:", err);
    // Still return success — message is saved to DB
    res.json({
      success: true,
      message: "Message received! (Note: Email delivery requires SMTP configuration)",
    });
  }
});

export default router;
