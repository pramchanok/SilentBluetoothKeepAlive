<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
 "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>com.silent.keepalive</string>

  <key>ProgramArguments</key>
  <array>
    <string>/usr/local/bin/node</string>
    <string>${HOME}/SilentBluetoothKeepAlive/silent.js</string>
  </array>

  <key>RunAtLoad</key>
  <true/>

  <key>StandardOutPath</key>
  <string>${HOME}/SilentBluetoothKeepAlive/daemon/silentbluetoothkeepalive.out.log</string>

  <key>StandardErrorPath</key>
  <string>${HOME}/SilentBluetoothKeepAlive/daemon/silentbluetoothkeepalive.err.log</string>
</dict>
</plist>
