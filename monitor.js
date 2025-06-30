const fetch = require("node-fetch");
const nodemailer = require("nodemailer");

// 🔗 The real website to monitor
const TARGET_URL = "https://sand.telangana.gov.in/TSSandPortal/Reports/UpdatesScrolling.aspx";

// 🕒 How often to check (ms)
const CHECK_INTERVAL = 30000;

let lastContent = "";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sandhyabiyyapu48@gmail.com",
    pass: "ryvw acsh wrab lgpz", // not your Gmail password
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
      console.log("🚨 Website update detected!");

      await transporter.sendMail({
        from: "sandhyabiyyapu48@gmail.com",
        to: "sandhyabiyyapu48@gmail.com",
        subject: "📢 Website Updated!",
        text: `Change detected at ${TARGET_URL}`,
      });

      console.log("📩 Email sent!");
    }

    lastContent = content;
  } catch (error) {
    console.error("❌ Error checking website:", error.message);
  }
}

// ⏱ Check every 30 seconds
setInterval(checkWebsite, CHECK_INTERVAL);
console.log("🚀 Monitor started...");
