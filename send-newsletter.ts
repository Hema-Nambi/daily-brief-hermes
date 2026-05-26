import nodemailer from "nodemailer";
import fs from "node:fs";
import path from "node:path";

const SMTP_HOST = process.env.SMTP_HOST!;
const SMTP_PORT = Number(process.env.SMTP_PORT ?? "587");
const SMTP_USER = process.env.SMTP_USER!;
const SMTP_PASS = process.env.SMTP_PASS!;

const RECIPIENTS = [
  "person1@example.com",
  "person2@example.com",
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
    port: SMTP_PORT,
    secure: false,
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