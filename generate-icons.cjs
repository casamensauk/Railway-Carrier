const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

function makeIcon(size, maskable) {
  const png = new PNG({ width: size, height: size });
  const cx = size / 2;
  const cy = size / 2;
  const safeR = maskable ? size * 0.36 : size * 0.46;
  const innerR = size * 0.18;
  const ringR = size * 0.31;
  const ringWidth = size * 0.012;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      let r = 26, g = 20, b = 16;
      if (d < safeR) { r = 35; g = 27; b = 22; }
      if (Math.abs(d - ringR) < ringWidth) { r = 217; g = 119; b = 6; }
      if (d < innerR) {
        const t = d / innerR;
        r = Math.round(217 * (1 - t * 0.4));
        g = Math.round(119 * (1 - t * 0.4));
        b = Math.round(6 + 20 * t);
      }
      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = 255;
    }
  }
  return PNG.sync.write(png);
}

const out = path.join(__dirname, 'public', 'icons');
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'icon-192.png'), makeIcon(192, false));
fs.writeFileSync(path.join(out, 'icon-512.png'), makeIcon(512, false));
fs.writeFileSync(path.join(out, 'maskable-512.png'), makeIcon(512, true));
console.log('icons written');
