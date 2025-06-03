const fs = require("fs");
const path = require("path");
const Speaker = require("speaker");

// ลบ log เก่าทุก 7 วัน
function cleanupOldLog() {
  const logFile = path.join(__dirname, "daemon", "silentbluetoothkeepalive.out.log");

  try {
    const stats = fs.statSync(logFile);
    const ageInDays = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);
    if (ageInDays > 7) {
      fs.unlinkSync(logFile);
      console.log("🧹 Log file removed (older than 7 days)");
    }
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("⚠️ Failed to delete log file:", err.message);
    }
  }
}

// เตรียม buffer ไว้ใช้ซ้ำ
function generateSilentToneBuffer(sampleRate, durationSec, freqHz, volume) {
  const samples = sampleRate * durationSec;
  const buffer = Buffer.alloc(samples * 2); // 16-bit mono = 2 bytes per sample

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const sample = Math.round(Math.sin(2 * Math.PI * freqHz * t) * 32767 * volume);
    buffer.writeInt16LE(sample, i * 2);
  }

  return buffer;
}

const sampleRate = 44100;
const duration = 1; // seconds
const freq = 15000; // Hz (15000 Hz volume ที่ต่ำปลอดภัยต่อคนและสัตว์และอุปกรณ์)
const volume = 0.001;
const toneBuffer = generateSilentToneBuffer(sampleRate, duration, freq, volume);

// เล่นเสียงทุก 5 นาที
function playSilentTone() {
  try {
    const speaker = new Speaker({
      channels: 1,
      bitDepth: 16,
      sampleRate
    });

    speaker.write(toneBuffer);
    speaker.end();

    const formatted = new Date().toLocaleString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    console.log("🔊 Silent tone triggered at", formatted);
  } catch (err) {
    console.error("❌ Failed to play tone:", err.message);
  }
}

// เริ่มต้น
cleanupOldLog();
setInterval(playSilentTone, 5 * 60 * 1000); // ทุก 5 นาที
