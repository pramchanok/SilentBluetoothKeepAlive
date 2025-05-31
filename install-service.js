const Service = require('node-windows').Service;
const path = require('path');

const svc = new Service({
  name: 'SilentBluetoothKeepAlive',
  description: 'Play silent tone every 5 minute to keep Bluetooth active',
  script: path.join(__dirname, 'silent.js'),
  nodeOptions: ['--harmony', '--max_old_space_size=128'],
});

svc.on('install', () => {
  console.log('✅ Service installed.');
  svc.start();
});

svc.on('start', () => console.log('🟢 Service started.'));
svc.on('error', (err) => console.error('❌ Error:', err));

svc.install();