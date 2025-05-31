const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
  name: 'SilentBluetoothKeepAlive',
  script: path.join(__dirname, 'silent.js'),
});

svc.on('uninstall', () => console.log('🧹 Service uninstalled.'));
svc.uninstall();