const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const logFile = path.join(__dirname, "daemon", "silentbluetoothkeepalive.out.log");
const toneFile = path.join(__dirname, "silent.wav");

// ลบ log เก่าทุก 7 วัน
function cleanupOldLog() {
  try {
    const stats = fs.statSync(logFile);
    const ageInDays = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);
    if (ageInDays > 7) {
      fs.unlinkSync(logFile);
      console.log("🧹 Log file removed");
    }
  } catch (err) {
    if (err.code !== "ENOENT") console.error("⚠️ Log error:", err.message);
  }
}

// สร้างไฟล์เสียงเงียบ (ถ้ายังไม่มี)
function createSilentWav(filePath) {
  const sampleRate = 44100;
  const duration = 1; // วินาที
  const freq = 15000; // Hz (15000 Hz volume ที่ต่ำปลอดภัยต่อคนและสัตว์และอุปกรณ์)
  const volume = 0.001;
  const samples = sampleRate * duration;
  const headerSize = 44;
  const buffer = Buffer.alloc(headerSize + samples * 2);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(buffer.length - 8, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples * 2, 40);

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const sample = Math.round(Math.sin(2 * Math.PI * freq * t) * 32767 * volume);
    buffer.writeInt16LE(sample, headerSize + i * 2);
  }

  fs.writeFileSync(filePath, buffer);
  console.log("🎧 silent.wav created.");
}

// เล่นเสียงด้วย ffplay
function playSilentTone() {
  exec(`ffplay -nodisp -autoexit -loglevel quiet "${toneFile}"`, (err) => {
    const now = new Date().toLocaleString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    if (err) console.error("❌ Failed to play tone:", err.message);
    else console.log("🔊 Silent tone triggered at", now);
  });
}

// เริ่มต้น
cleanupOldLog();
if (!fs.existsSync(toneFile)) createSilentWav(toneFile);
setInterval(playSilentTone, 5 * 60 * 1000); // ทุก 5 นาที

