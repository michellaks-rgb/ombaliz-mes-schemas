const { writeFileSync } = require('node:fs');
const { join } = require('node:path');
const QRCode = require('./vendor/QRCode');
const { M } = require('./vendor/QRCode/QRErrorCorrectLevel');

const externalUrl = process.env.RENDER_EXTERNAL_URL;
if (!externalUrl) throw new Error('RENDER_EXTERNAL_URL is required to build the flashcode.');
const url = new URL('/', externalUrl);

const qr = new QRCode(-1, M);
qr.addData(url.href);
qr.make();

const quietZone = 4;
const size = qr.getModuleCount() + quietZone * 2;
const cells = [];
for (let row = 0; row < qr.getModuleCount(); row++) {
  for (let col = 0; col < qr.getModuleCount(); col++) {
    if (qr.isDark(row, col)) cells.push(`M${col + quietZone},${row + quietZone}h1v1h-1z`);
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="256" height="256" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path fill="#205c6a" d="${cells.join('')}"/></svg>\n`;
writeFileSync(join(__dirname, '../public/assets/qr.svg'), svg);
console.log(`Flashcode créé pour ${url.href}`);
