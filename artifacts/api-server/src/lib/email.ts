import nodemailer from "nodemailer";

/**
 * SMTP EMAIL UTILITY
 *
 * Set these environment variables in Replit Secrets to enable real email delivery:
 *   SMTP_HOST     — e.g. "smtp.gmail.com"
 *   SMTP_PORT     — e.g. "587"
 *   SMTP_USER     — your sender email address
 *   SMTP_PASS     — your app password (for Gmail: Google Account → Security → App Passwords)
 *   CONTACT_TO    — store owner / recipient email
 *
 * Without these vars the server still works — messages/orders are saved to DB
 * and a console log is printed instead of sending an email.
 */

export function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
}

// ─── Shared HTML wrapper ────────────────────────────────────────────────────

function luxeEmailWrapper(subtitle: string, body: string): string {
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 620px; margin: 0 auto; background: #fdfaf7; color: #2c2419;">
      <!-- Header -->
      <div style="background: #2c2419; padding: 36px 40px;">
        <h1 style="margin: 0; font-size: 28px; letter-spacing: 0.15em; color: #f5f0eb; font-weight: 400;">LUXE.</h1>
        <p style="margin: 6px 0 0; color: #8b7d6b; font-size: 13px; letter-spacing: 0.05em;">${subtitle}</p>
      </div>
      <!-- Body -->
      <div style="padding: 40px; background: #fff; border: 1px solid #e8e0d8; border-top: none;">
        ${body}
      </div>
      <!-- Footer -->
      <div style="padding: 24px 40px; text-align: center; font-size: 12px; color: #a09080;">
        <p style="margin: 0;">LUXE Furniture · 123 Design District Blvd, Suite 400, New York, NY 10001</p>
        <p style="margin: 6px 0 0;"><a href="mailto:concierge@luxefurniture.com" style="color: #8b7d6b;">concierge@luxefurniture.com</a></p>
      </div>
    </div>
  `;
}

// ─── Contact form email ──────────────────────────────────────────────────────

export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const to = process.env.CONTACT_TO || process.env.SMTP_USER;
  const transporter = createTransporter();

  if (!transporter || !to) {
    console.log(`[Email] SMTP not configured. Contact from ${data.name} <${data.email}>: ${data.subject}`);
    return;
  }

  const body = `
    <h2 style="color: #2c2419; font-size: 20px; font-weight: 400; margin: 0 0 24px;">New Contact Inquiry</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr><td style="padding: 10px 0; color: #8b7d6b; font-size: 13px; width: 90px; font-weight: 600; vertical-align: top;">From:</td><td style="padding: 10px 0;">${data.name}</td></tr>
      <tr><td style="padding: 10px 0; color: #8b7d6b; font-size: 13px; font-weight: 600;">Email:</td><td style="padding: 10px 0;"><a href="mailto:${data.email}" style="color: #8b7d6b;">${data.email}</a></td></tr>
      <tr><td style="padding: 10px 0; color: #8b7d6b; font-size: 13px; font-weight: 600;">Subject:</td><td style="padding: 10px 0;">${data.subject}</td></tr>
    </table>
    <hr style="border: none; border-top: 1px solid #e8e0d8; margin: 0 0 24px;" />
    <h3 style="color: #8b7d6b; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 12px;">Message</h3>
    <p style="line-height: 1.7; margin: 0; white-space: pre-wrap; color: #2c2419;">${data.message}</p>
  `;

  await transporter.sendMail({
    from: `"LUXE Contact Form" <${process.env.SMTP_USER}>`,
    replyTo: data.email,
    to,
    subject: `[LUXE Contact] ${data.subject}`,
    html: luxeEmailWrapper("New Contact Form Submission", body),
    text: `Contact from ${data.name} <${data.email}>\nSubject: ${data.subject}\n\n${data.message}`,
  });
}

// ─── Order emails ────────────────────────────────────────────────────────────

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

function buildTotalsBlock(order: OrderEmailData): string {
  return `
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
      <tr><td style="padding: 6px 0; color: #8b7d6b;">Subtotal</td><td style="padding: 6px 0; text-align: right;">$${order.subtotal.toLocaleString()}</td></tr>
      <tr><td style="padding: 6px 0; color: #8b7d6b;">Shipping</td><td style="padding: 6px 0; text-align: right;">${order.shippingCost === 0 ? "Complimentary" : "$" + order.shippingCost.toLocaleString()}</td></tr>
      <tr><td style="padding: 6px 0; color: #8b7d6b;">Tax</td><td style="padding: 6px 0; text-align: right;">$${order.tax.toLocaleString()}</td></tr>
      <tr style="font-size: 16px; font-weight: 600;">
        <td style="padding: 12px 0; border-top: 2px solid #e8e0d8;">Total</td>
        <td style="padding: 12px 0; border-top: 2px solid #e8e0d8; text-align: right;">$${order.total.toLocaleString()}</td>
      </tr>
    </table>
  `;
}

// Customer confirmation email
export async function sendOrderConfirmation(order: OrderEmailData) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log(`[Email] SMTP not configured. Order confirmation for ${order.customerEmail}: ${order.orderNumber}`);
    return;
  }

  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0e8e0; color: #2c2419;">${item.name}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0e8e0; text-align: center; color: #8b7d6b;">×${item.quantity}</td>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0e8e0; text-align: right; color: #2c2419;">$${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join("");

  const body = `
    <h2 style="color: #2c2419; font-size: 22px; font-weight: 400; margin: 0 0 8px;">Thank you, ${order.customerName.split(" ")[0]}.</h2>
    <p style="color: #8b7d6b; margin: 0 0 32px; line-height: 1.6;">Your order has been received and is being prepared with care. You'll receive a shipping update once your pieces are on their way.</p>
    
    <div style="background: #fdfaf7; border: 1px solid #e8e0d8; border-radius: 8px; padding: 20px; margin-bottom: 32px;">
      <p style="margin: 0; font-size: 13px; color: #8b7d6b; text-transform: uppercase; letter-spacing: 0.08em;">Order Number</p>
      <p style="margin: 4px 0 0; font-size: 24px; font-weight: 400; letter-spacing: 0.1em;">${order.orderNumber}</p>
    </div>

    <h3 style="color: #8b7d6b; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 16px;">Your Items</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <thead><tr>
        <th style="padding: 8px 0; border-bottom: 2px solid #e8e0d8; text-align: left; font-size: 12px; color: #8b7d6b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em;">Item</th>
        <th style="padding: 8px 0; border-bottom: 2px solid #e8e0d8; text-align: center; font-size: 12px; color: #8b7d6b; font-weight: 600;">Qty</th>
        <th style="padding: 8px 0; border-bottom: 2px solid #e8e0d8; text-align: right; font-size: 12px; color: #8b7d6b; font-weight: 600;">Price</th>
      </tr></thead>
      <tbody>${itemRows}</tbody>
    </table>

    ${buildTotalsBlock(order)}

    <h3 style="color: #8b7d6b; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 12px;">Shipping To</h3>
    <p style="color: #2c2419; margin: 0 0 32px; line-height: 1.6; white-space: pre-wrap;">${order.shippingAddress}</p>

    <p style="color: #8b7d6b; font-size: 13px; line-height: 1.6; margin: 0; border-top: 1px solid #e8e0d8; padding-top: 24px;">
      Questions about your order? Reply to this email or contact us at <a href="mailto:concierge@luxefurniture.com" style="color: #8b7d6b;">concierge@luxefurniture.com</a>
    </p>
  `;

  await transporter.sendMail({
    from: `"LUXE Furniture" <${process.env.SMTP_USER}>`,
    to: order.customerEmail,
    subject: `Order Confirmed — ${order.orderNumber}`,
    html: luxeEmailWrapper("Order Confirmation", body),
    text: `Thank you ${order.customerName}!\n\nOrder: ${order.orderNumber}\n\nItems:\n${order.items.map(i => `  ${i.name} ×${i.quantity} — $${(i.price * i.quantity).toLocaleString()}`).join("\n")}\n\nSubtotal: $${order.subtotal}\nShipping: ${order.shippingCost === 0 ? "Complimentary" : "$" + order.shippingCost}\nTax: $${order.tax}\nTotal: $${order.total}\n\nShip to: ${order.shippingAddress}`,
  });
}

// Store owner notification email
export async function sendOrderNotification(order: OrderEmailData) {
  const to = process.env.CONTACT_TO || process.env.SMTP_USER;
  const transporter = createTransporter();
  if (!transporter || !to) {
    console.log(`[Email] SMTP not configured. New order ${order.orderNumber} from ${order.customerEmail}`);
    return;
  }

  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0e8e0;">${item.name}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0e8e0; text-align: center;">×${item.quantity}</td>
      <td style="padding: 10px 0; border-bottom: 1px solid #f0e8e0; text-align: right;">$${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join("");

  const body = `
    <h2 style="color: #2c2419; font-size: 22px; font-weight: 400; margin: 0 0 8px;">New Order Received</h2>
    <p style="color: #8b7d6b; margin: 0 0 32px;">Order <strong>${order.orderNumber}</strong> has been placed and saved to the database.</p>

    <h3 style="color: #8b7d6b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px;">Customer</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
      <tr><td style="padding: 8px 0; color: #8b7d6b; width: 120px;">Name:</td><td style="padding: 8px 0;">${order.customerName}</td></tr>
      <tr><td style="padding: 8px 0; color: #8b7d6b;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${order.customerEmail}" style="color: #8b7d6b;">${order.customerEmail}</a></td></tr>
    </table>

    <h3 style="color: #8b7d6b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px;">Ship To</h3>
    <p style="margin: 0 0 32px; white-space: pre-wrap; line-height: 1.6;">${order.shippingAddress}</p>

    <h3 style="color: #8b7d6b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px;">Items Ordered</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <thead><tr>
        <th style="padding: 8px 0; border-bottom: 2px solid #e8e0d8; text-align: left; font-size: 12px; color: #8b7d6b; font-weight: 600;">Item</th>
        <th style="padding: 8px 0; border-bottom: 2px solid #e8e0d8; text-align: center; font-size: 12px; color: #8b7d6b; font-weight: 600;">Qty</th>
        <th style="padding: 8px 0; border-bottom: 2px solid #e8e0d8; text-align: right; font-size: 12px; color: #8b7d6b; font-weight: 600;">Price</th>
      </tr></thead>
      <tbody>${itemRows}</tbody>
    </table>

    ${buildTotalsBlock(order)}
  `;

  await transporter.sendMail({
    from: `"LUXE Orders" <${process.env.SMTP_USER}>`,
    to,
    subject: `[New Order] ${order.orderNumber} — $${order.total.toLocaleString()} from ${order.customerName}`,
    html: luxeEmailWrapper("New Order Notification", body),
    text: `New order ${order.orderNumber}\nCustomer: ${order.customerName} <${order.customerEmail}>\nTotal: $${order.total}\nShip to: ${order.shippingAddress}\n\nItems:\n${order.items.map(i => `  ${i.name} ×${i.quantity}`).join("\n")}`,
  });
}

// ─── FAQ notification email ──────────────────────────────────────────────────

export async function sendFaqNotification(data: {
  customerName: string;
  customerEmail: string;
  productName: string;
  productId: string;
  question: string;
}) {
  const to = process.env.CONTACT_TO || process.env.SMTP_USER;
  const transporter = createTransporter();

  if (!transporter || !to) {
    console.log(
      `[Email] SMTP not configured. New FAQ from ${data.customerName} <${data.customerEmail}> on "${data.productName}": ${data.question}`
    );
    return;
  }

  const body = `
    <h2 style="color: #2c2419; font-size: 20px; font-weight: 400; margin: 0 0 8px;">New Product Question</h2>
    <p style="color: #8b7d6b; margin: 0 0 32px;">A customer has submitted a question and is awaiting your reply.</p>

    <h3 style="color: #8b7d6b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px;">Customer</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 32px;">
      <tr><td style="padding: 8px 0; color: #8b7d6b; width: 120px;">Name:</td><td style="padding: 8px 0;">${data.customerName}</td></tr>
      <tr><td style="padding: 8px 0; color: #8b7d6b;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${data.customerEmail}" style="color: #8b7d6b;">${data.customerEmail}</a></td></tr>
    </table>

    <h3 style="color: #8b7d6b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px;">Product</h3>
    <p style="margin: 0 0 32px; color: #2c2419;">${data.productName}</p>

    <h3 style="color: #8b7d6b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 12px;">Question</h3>
    <p style="margin: 0; line-height: 1.7; color: #2c2419; font-size: 15px; padding: 16px; background: #fdfaf7; border-left: 3px solid #8b7d6b;">${data.question}</p>

    <p style="margin: 32px 0 0; color: #8b7d6b; font-size: 13px; line-height: 1.6;">
      To answer this question, use the admin API:<br/>
      <code style="background: #f5f0eb; padding: 2px 6px; border-radius: 3px;">PATCH /api/admin/faqs/:id</code>
    </p>
  `;

  await transporter.sendMail({
    from: `"LUXE Customer Questions" <${process.env.SMTP_USER}>`,
    replyTo: data.customerEmail,
    to,
    subject: `[New Question] "${data.productName}" — from ${data.customerName}`,
    html: luxeEmailWrapper("New Product FAQ Submission", body),
    text: `New question on "${data.productName}"\nFrom: ${data.customerName} <${data.customerEmail}>\n\nQuestion:\n${data.question}`,
  });
}
