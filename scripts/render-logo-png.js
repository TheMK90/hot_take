// Renders every SVG in assets/logo/svg to PNG under assets/logo/png.
// The SVGs are the masters; this script is the only thing that should write PNGs.
//
//   npm install sharp
//   node scripts/render-logo-png.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..', 'assets', 'logo');
const svgDir = path.join(root, 'svg');
const pngDir = path.join(root, 'png');

// App icons render at the standard launcher sizes; marks and lockups get
// 1x/2x/3x of their natural size so they drop straight into a UI.
const ICON_SIZES = [1024, 512, 256, 180, 128, 64, 48, 32, 16];
const ART_SCALES = [1, 2, 3];

async function main() {
  const files = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg')).sort();
  let count = 0;

  for (const file of files) {
    const base = path.basename(file, '.svg');
    const svg = fs.readFileSync(path.join(svgDir, file));
    const meta = await sharp(svg).metadata();
    const outDir = path.join(pngDir, base);
    fs.mkdirSync(outDir, { recursive: true });

    const targets = base.includes('-icon-')
      ? ICON_SIZES.map(s => ({ name: `${base}-${s}.png`, width: s }))
      : ART_SCALES.map(s => ({ name: `${base}@${s}x.png`, width: meta.width * s }));

    for (const t of targets) {
      await sharp(svg, { density: 384 })
        .resize({ width: t.width })
        .png({ compressionLevel: 9 })
        .toFile(path.join(outDir, t.name));
      count++;
    }
    console.log(`${base}: ${targets.length} png (source ${meta.width}x${meta.height})`);
  }
  console.log(`\ntotal: ${count} PNG files`);
}

main().catch(e => { console.error(e); process.exit(1); });
