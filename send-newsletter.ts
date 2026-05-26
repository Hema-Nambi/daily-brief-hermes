import nodemailer from "nodemailer";
import "dotenv/config";

import fs from "node:fs";
import path from "node:path";

const SMTP_HOST = process.env.SMTP_HOST!;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? "587");
const SMTP_USER = process.env.SMTP_USER!;
const SMTP_PASS = process.env.SMTP_PASS!;

const RECIPIENTS = [
  "hemnam24@gmail.com",
  "arvind.mohanraj@gmail.com",
  "shreepriyaraj@gmail.com",
];

async function main() {
  const [, , filePath] = process.argv;
  if (!filePath) {
    console.error("Usage: node send-newsletter.js path/to/newsletter.md");
    process.exit(1);
  }

  const fullPath = path.resolve(filePath);
  const body = fs.readFileSync(fullPath, "utf8");

  const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: 465,        // changed from 587
  secure: true,     // changed from false — required for port 465
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

  await transporter.sendMail({
    from: SMTP_USER,
    to: RECIPIENTS.join(", "),
    subject: "Daily Brief Newsletter",
    text: body, // or html: body if you convert to HTML
  });

  console.log("Newsletter sent!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});