const fs = require("fs");
const path = require("path");
const Speaker = require("speaker");
const generate = require("tonegenerator");

// 🗑️ ลบ log เก่าทุก 7 วัน (ในโฟลเดอร์ daemon)
function cleanupOldLog() {
  const logFile = path.join(__dirname, "daemon", "silentbluetoothkeepalive.out.log");

  if (fs.existsSync(logFile)) {
    const stats = fs.statSync(logFile);
    const now = new Date();
    const lastModified = new Date(stats.mtime);
    const ageInDays = (now - lastModified) / (1000 * 60 * 60 * 24);

    if (ageInDays > 7) {
      try {
        fs.unlinkSync(logFile);
        console.log("🧹 Log file removed (older than 7 days)");
      } catch (err) {
        console.error("⚠️ Failed to delete log file:", err);
      }
    }
  }
}

// 🔊 เล่นเสียงเงียบ
function playSilentTone() {
  const sampleRate = 44100;
  const duration = 1; // 1 second
  const freq = 15000; //  human-audible frequency Hz - ปลอดภัยที่สุด
  const volume = 0.001;

  const speaker = new Speaker({
    channels: 1,
    bitDepth: 16,
    sampleRate
  });

  const buffer = Buffer.alloc(sampleRate * 2 * duration); // 16-bit (2 bytes)

  for (let i = 0; i < sampleRate * duration; i++) {
    const t = i / sampleRate;
    const sample = Math.round(Math.sin(2 * Math.PI * freq * t) * 32767 * volume);
    buffer.writeInt16LE(sample, i * 2);
  }

  const now = new Date();
  const formatted = now.toLocaleString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  try {
    speaker.write(buffer);
    speaker.end();
    console.log("🔊 Silent tone triggered at", formatted);
  } catch (err) {
    console.error("❌ Failed to play tone:", err.message);
  }
}

// 🏁 เริ่มทำงาน
cleanupOldLog(); // เรียกครั้งเดียวตอนเริ่ม
setInterval(playSilentTone, 300000); // เล่นเสียงทุก 5 นาที
