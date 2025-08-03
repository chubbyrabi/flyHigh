// server.js
const express = require('express');
const compression = require('compression');
const path = require('path');
const os = require('os');

const app = express();
const PORT = 3000;

app.use(compression());
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, '0.0.0.0', () => {
const interfaces = os.networkInterfaces();
let localIP = 'localhost';

// 嘗試取得本機區域網路 IP（IPv4）
for (const name of Object.keys(interfaces)) {
	for (const iface of interfaces[name]) {
		if (iface.family === 'IPv4' && !iface.internal) {
			localIP = iface.address;
			break;
		}
	}
	if (localIP !== 'localhost') break;
}

// 啟動時輸出本機與手機可用網址
console.log(`\n壓縮伺服器啟動成功！`);
console.log(`手機可使用：http://${localIP}:${PORT}`);
console.log(`本機可使用：http://localhost:${PORT}\n`);
});