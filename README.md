
# SilentBluetoothKeepAlive

A small Node.js service that plays a near-silent tone every 5 minute to prevent Bluetooth speakers (e.g., Marshall Acton III) from disconnecting due to inactivity.

## 📦 Features

- Keeps Bluetooth audio connection alive by playing a very low-volume tone.
- Runs as a **Windows Service**.
- **Auto-starts** with Windows boot.
- **No user interface**, runs quietly in the background.

---

## 🛠️ Installation

### ✅ Prerequisites

- Windows 10/11
- [Node.js](https://nodejs.org) installed
- Run commands as **Administrator**

### 📁 Install Steps

1. Extract the ZIP folder.
2. Open `PowerShell` or `Command Prompt` as **Administrator**.
3. Navigate to the folder you extracted:
   ```bash
   cd path\to\SilentBluetoothKeepAlive
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Install the service:
   ```bash
   npm run service-i or node install-service.js
   ```

If successful, the service will start immediately and run silently.

---

## 🧹 Uninstallation

To uninstall the service:

```bash
npm run service-u or node uninstall-service.js
```

---

## 🧪 Testing

To manually test the tone script without the service:

```bash
npm run start or node silent.js
```

You will see logs every 15 seconds confirming a silent tone was played.

---

## ❓ Notes

- The tone frequency is 15000 Hz at 0.001 volume — inaudible to humans but sufficient to maintain Bluetooth activity. (15000 Hz volume ที่ต่ำปลอดภัยต่อคนและสัตว์และอุปกรณ์)
- Ensure the PC audio output is set to the **Bluetooth speaker**.
- This tool does **not** produce any sound that you can hear.
- Ideal for users with speakers like Marshall Acton III which auto-disconnect on silence.

---

## © License

MIT — use freely at your own risk.
