import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function crc32(buf) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
  }
  table[i] = c;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const crcPayload = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcPayload), 0);

  return Buffer.concat([len, crcPayload, crc]);
}

function createPng(width, height, isMaskable) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(6, 9); // RGBA color type
  ihdr.writeUInt8(0, 10); // compression
  ihdr.writeUInt8(0, 11); // filter
  ihdr.writeUInt8(0, 12); // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);

  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowBytes);

  const cx = width / 2;
  const cy = height / 2;
  const scale = width / 512;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[y * rowBytes] = 0; // filter type 0: None

    for (let x = 0; x < width; x++) {
      const pOffset = rowOffset + 1 + x * 4;

      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default dark theme background (#0D0D0E)
      let r = 13, g = 13, b = 14, a = 255;

      const radius = width * (isMaskable ? 0.38 : 0.44);

      if (dist <= radius) {
        const gradT = (y / height);
        r = Math.round(18 + 5 * gradT);
        g = Math.round(22 + 4 * gradT);
        b = Math.round(35 + 2 * gradT);

        // Gold outer ring
        if (dist >= radius - 8 * scale && dist <= radius) {
          r = 255; g = 159; b = 10;
        }

        const trainX = Math.abs(dx) / scale;
        const trainY = dy / scale;

        if (trainX <= 75 && trainY >= -85 && trainY <= 65) {
          r = 10; g = 132; b = 255;

          if (trainX <= 60 && trainY >= -65 && trainY <= -15) {
            r = 15; g = 20; b = 30;
          }

          const leftLight = Math.sqrt((dx / scale + 45) ** 2 + (trainY - 30) ** 2);
          const rightLight = Math.sqrt((dx / scale - 45) ** 2 + (trainY - 30) ** 2);
          if (leftLight <= 14 || rightLight <= 14) {
            r = 255; g = 159; b = 10;
          }

          const centerStar = Math.sqrt((dx / scale) ** 2 + (trainY - 26) ** 2);
          if (centerStar <= 10) {
            r = 255; g = 220; b = 100;
          }

          if (trainX <= 68 && trainY >= 48 && trainY <= 56) {
            r = 255; g = 159; b = 10;
          }
        }

        if (trainY >= 80 && trainY <= 120 && trainX <= 160) {
          if (trainY >= 80 && trainY <= 88) {
            r = 255; g = 159; b = 10;
          }
          const archIdx = Math.floor((dx / scale + 150) / 60);
          const archCenter = -150 + archIdx * 60 + 30;
          const archDist = Math.sqrt((dx / scale - archCenter) ** 2 + (trainY - 110) ** 2);
          if (archDist >= 22 && archDist <= 28 && trainY <= 110) {
            r = 255; g = 159; b = 10;
          }
        }
      }

      rawData[pOffset] = r;
      rawData[pOffset + 1] = g;
      rawData[pOffset + 2] = b;
      rawData[pOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, false));

console.log('PWA PNG icons generated successfully in public/');
