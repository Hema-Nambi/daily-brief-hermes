import dotenv from "dotenv";
import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import nodemailer from "nodemailer";
import { marked } from "marked";

dotenv.config({ path: path.join(os.homedir(), ".hermes", ".env") });

const SMTP_HOST = process.env.SMTP_HOST!;
const SMTP_PORT = 465;
const SMTP_USER = process.env.SMTP_USER!;
const SMTP_PASS = process.env.SMTP_PASS!;

const RECIPIENTS = [
  "person1@gmail.com",
  "person2@gmail.com",
  "person3@gmail.com",
];

async function main() {
  const [, , filePath] = process.argv;
  if (!filePath) {
    console.error("Usage: npx tsx send-newsletter.ts path/to/newsletter.md");
    process.exit(1);
  }

  const fullPath = path.resolve(filePath);
  console.log("Reading file from:", fullPath);

  if (!fs.existsSync(fullPath)) {
    console.error("File not found:", fullPath);
    process.exit(1);
  }

  const body = fs.readFileSync(fullPath, "utf8");
  console.log("File content length:", body.length, "chars");

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f4f4f0; font-family: Georgia, serif; }
  .wrap { max-width: 620px; margin: 0 auto; background: #fff; }
  .header { background: #1a1a2e; padding: 36px 40px 28px; text-align: center; }
  .header-date { color: #a0a0c0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; font-family: monospace; margin-bottom: 10px; }
  .header-title { color: #fff; font-size: 30px; font-weight: normal; }
  .header-title span { color: #e8a838; }
  .header-sub { color: #7070a0; font-size: 13px; margin-top: 8px; font-family: monospace; }
  .divider { height: 4px; background: linear-gradient(90deg,#e8a838,#e85038 40%,#3870e8 70%,#38c8a8); }
  .body { padding: 32px 40px; }
  h2 { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #888; font-family: monospace; border-bottom: 1px solid #e8e8e0; padding-bottom: 10px; margin: 28px 0 16px; }
  h3 { font-size: 15px; color: #1a1a2e; margin-bottom: 4px; }
  li { font-size: 13px; color: #606060; line-height: 1.6; font-family: Arial, sans-serif; margin-bottom: 12px; border-bottom: 1px solid #f0f0ea; padding-bottom: 12px; list-style: none; }
  .footer { background: #1a1a2e; padding: 24px 40px; text-align: center; color: #505070; font-size: 12px; font-family: monospace; line-height: 1.8; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="header-date">${new Date().toLocaleDateString("en-CA", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}</div>
    <div class="header-title">Daily <span>Brief</span></div>
    <div class="header-sub">Your morning intelligence report</div>
  </div>
  <div class="divider"></div>
  <div class="body">
    ${await marked(body)}
  </div>
  <div class="footer">Daily Brief · Delivered by Hermes Agent<br>Hamilton, Ontario</div>
</div>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Daily Brief 📰" <${SMTP_USER}>`,
    to: RECIPIENTS.join(", "),
    subject: `Daily Brief — ${new Date().toLocaleDateString("en-CA", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    })}`,
    html: htmlBody,
  });

  console.log("Newsletter sent!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
