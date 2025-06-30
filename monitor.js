require("dotenv").config();
const fetch = require("node-fetch");
const nodemailer = require("nodemailer");

const TARGET_URL = process.env.TARGET_URL;
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL, 10) || 30000;

let lastContent = "";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function checkWebsite() {
  try {
    const res = await fetch(TARGET_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      },
    });

    const content = await res.text();

    if (lastContent && content !== lastContent) {
      console.log("🚨 Change detected!");

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "📢 Website Updated!",
        text: `Change detected at ${TARGET_URL}`,
      });

      console.log("📩 Email sent successfully!");
    }

    lastContent = content;
  } catch (err) {
    console.error("❌ Error fetching website:", err.message);
  }
}

setInterval(checkWebsite, CHECK_INTERVAL);
console.log(`🚀 Monitoring ${TARGET_URL} every ${CHECK_INTERVAL / 1000} seconds...`);
