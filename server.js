// server.js
const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(compression());
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, () => {
  console.log(`壓縮伺服器啟動：http://localhost:${PORT}`);
});