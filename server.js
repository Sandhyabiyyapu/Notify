const express = require("express");
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ========== Monitor Logic ==========

const TARGET_URL = process.env.TARGET_URL;
const CHECK_INTERVAL = parseInt(process.env.CHECK_INTERVAL) || 30000;

let lastContent = "";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function checkForUpdate() {
  try {
    const res = await fetch(TARGET_URL);
    const text = await res.text();

    if (lastContent && text !== lastContent) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "📢 Website Updated!",
        text: `Change detected at ${TARGET_URL}`,
      });
      console.log("🔔 Update detected and email sent!");
    } else {
      console.log("✅ No change.");
    }

    lastContent = text;
  } catch (err) {
    console.error("❌ Error checking website:", err.message);
  }
}

// Run the checker on interval
setInterval(checkForUpdate, CHECK_INTERVAL);
checkForUpdate(); // Initial check

// ========== Keep Render alive ==========

app.get("/", (req, res) => {
  res.send("🟢 Website Monitor is running.");
});

app.listen(PORT, () => {
  console.log(`🌐 Server listening on port ${PORT}`);
});
