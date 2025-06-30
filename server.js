const express = require("express");
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");
const app = express();

const PORT = process.env.PORT || 3000;
let lastContent = "";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sandhyabiyyapu48@gmail.com",
    pass: "cwpn juha vykq nmf",
  },
});

const TARGET_URL = "https://friendly-upd8-demo.glitch.me/"; // Replace with your real website URL

async function checkWebsite() {
  try {
    const res = await fetch(TARGET_URL);
    const content = await res.text();

    if (lastContent && content !== lastContent) {
      console.log("🚨 Update Detected!");
      await transporter.sendMail({
        from: "your_email@gmail.com",
        to: "your_email@gmail.com", // or another address
        subject: "Website Update Alert",
        text: "New update detected on the monitored website!",
      });
    }
    lastContent = content;
  } catch (e) {
    console.error("Error checking website:", e.message);
  }
}

setInterval(checkWebsite, 30000); // check every 30 seconds

app.get("/", (req, res) => {
  res.send("Monitoring...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
