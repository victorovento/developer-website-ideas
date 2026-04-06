#!/usr/bin/env node
// Generates public/favicon.ico — 32x32 BGRA BMP-based ICO with the </> logo.
// No external dependencies required.

const fs   = require('fs');
const path = require('path');

const W = 32, H = 32;
const BG  = [0x11, 0x11, 0x11, 0xff]; // #111111
const RED = [0x35, 0x39, 0xe5, 0xff]; // #e53935 stored as BGRA

// ---------- pixel canvas ----------
const img = Array.from({ length: H }, () =>
  Array.from({ length: W }, () => [...BG])
);

function setPixel(x, y, color) {
  if (x >= 0 && x < W && y >= 0 && y < H) img[y][x] = color;
}

function drawLine(x0, y0, x1, y1, r = 1) {
  let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  let sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx - dy, x = x0, y = y0;
  while (true) {
    for (let ty = -r; ty <= r; ty++)
      for (let tx = -r; tx <= r; tx++)
        if (tx * tx + ty * ty <= r * r) setPixel(x + tx, y + ty, RED);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x += sx; }
    if (e2 <  dx) { err += dx; y += sy; }
  }
}

// Rounded background rect (corner fill → soften 22-radius feel at 32px)
const CORNER = 4;
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const cx = Math.max(0, Math.max(CORNER - x, x - (W - 1 - CORNER)));
    const cy = Math.max(0, Math.max(CORNER - y, y - (H - 1 - CORNER)));
    if (cx * cx + cy * cy > CORNER * CORNER) img[y][x] = [0, 0, 0, 0]; // transparent corner
  }

// <  (apex at x=4, open at x=11, vertical centre 16)
drawLine(11,  8,  4, 16, 1);
drawLine( 4, 16, 11, 24, 1);

// /  (bottom-left to top-right)
drawLine(15, 25, 19,  7, 1);

// >  (apex at x=28, open at x=21)
drawLine(21,  8, 28, 16, 1);
drawLine(28, 16, 21, 24, 1);

// ---------- BMP pixel data (bottom-to-top, BGRA) ----------
const pixelData = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const off = ((H - 1 - y) * W + x) * 4;
    const [b, g, r, a] = img[y][x];
    pixelData[off] = b; pixelData[off + 1] = g;
    pixelData[off + 2] = r; pixelData[off + 3] = a;
  }
}

// AND mask (all zeros → let alpha channel control transparency)
const maskRowBytes = Math.ceil(W / 32) * 4;
const andMask = Buffer.alloc(maskRowBytes * H, 0x00);

// BITMAPINFOHEADER (40 bytes)
const bih = Buffer.alloc(40);
bih.writeUInt32LE(40,      0);  // biSize
bih.writeInt32LE (W,       4);  // biWidth
bih.writeInt32LE (H * 2,   8);  // biHeight (×2 = pixel rows + mask rows)
bih.writeUInt16LE(1,      12);  // biPlanes
bih.writeUInt16LE(32,     14);  // biBitCount (32-bit BGRA)

const imageData = Buffer.concat([bih, pixelData, andMask]);

// ICONDIR header (6 bytes)
const iconDir = Buffer.alloc(6);
iconDir.writeUInt16LE(0, 0);  // reserved
iconDir.writeUInt16LE(1, 2);  // type = 1 (ICO)
iconDir.writeUInt16LE(1, 4);  // image count

// ICONDIRENTRY (16 bytes)
const entry = Buffer.alloc(16);
entry.writeUInt8   (W,               0);  // width
entry.writeUInt8   (H,               1);  // height
entry.writeUInt8   (0,               2);  // color count
entry.writeUInt8   (0,               3);  // reserved
entry.writeUInt16LE(1,               4);  // planes
entry.writeUInt16LE(32,              6);  // bit count
entry.writeUInt32LE(imageData.length, 8); // bytes in resource
entry.writeUInt32LE(6 + 16,         12); // offset to image data

const ico = Buffer.concat([iconDir, entry, imageData]);
const out = path.join(__dirname, '../public/favicon.ico');
fs.writeFileSync(out, ico);
console.log(`✅  favicon.ico written (${ico.length} bytes)`);
