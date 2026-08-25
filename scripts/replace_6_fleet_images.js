import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fleetDir = path.join(__dirname, '..', 'public', 'images', 'fleet');

const targets = [
  {
    id: 'bolero',
    name: 'Mahindra Bolero',
    source: 'CarWale',
    url: 'https://imgd.aeplcdn.com/1920x1080/n/cw/ec/210987/bolero-exterior-right-front-three-quarter-3.png?isig=0&q=80&q=80',
    file: 'bolero.webp'
  },
  {
    id: 'ertiga',
    name: 'Maruti Suzuki Ertiga',
    source: 'CarWale',
    url: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/120337/maruti-suzuki-ertiga-left-front-three-quarter0.jpeg?isig=0',
    file: 'ertiga.webp'
  },
  {
    id: 'scorpio',
    name: 'Mahindra Scorpio (Classic)',
    source: 'RushLane',
    url: 'https://www.rushlane.com/wp-content/uploads/2026/04/mahindra-scorpio-classic.jpg',
    file: 'scorpio.webp'
  },
  {
    id: 'scorpio-n',
    name: 'Mahindra Scorpio-N',
    source: 'LiveMint',
    url: 'https://images.livemint.com/img/2022/09/02/original/Mahindra_Scorpio_N_1662098067527.jpg',
    file: 'scorpio-n.webp'
  },
  {
    id: 's-cross',
    name: 'Maruti Suzuki S-Cross',
    source: 'YouTube rmY8Q0ARF0s',
    url: 'https://i.ytimg.com/vi/rmY8Q0ARF0s/maxresdefault.jpg',
    file: 's-cross.webp'
  },
  {
    id: 'tigor',
    name: 'Tata Tigor',
    source: 'Autocar India',
    url: 'https://cdn-s3.autocarindia.com/Tata/Tigor/_DSC0093.JPG',
    file: 'tigor.webp'
  }
];

function download(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const reqHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      ...headers
    };
    mod.get(url, { headers: reqHeaders }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          const u = new URL(url);
          redirectUrl = u.origin + redirectUrl;
        }
        return download(redirectUrl, headers).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers['content-type'] }));
    }).on('error', reject);
  });
}

async function testAll() {
  console.log('Testing and downloading 6 target reference images...\n');
  for (const t of targets) {
    try {
      console.log(`Downloading ${t.id} (${t.name}) from ${t.source}...`);
      const { buffer, contentType } = await download(t.url);
      console.log(`  Received ${buffer.length} bytes, type: ${contentType}`);
      
      const outPath = path.join(fleetDir, t.file);
      await sharp(buffer)
        .resize(1000, 667, { fit: 'cover', position: 'center' })
        .webp({ quality: 85 })
        .toFile(outPath);
      
      const stats = fs.statSync(outPath);
      console.log(`  ✓ Saved to ${outPath} (${(stats.size/1024).toFixed(1)} KB)\n`);
    } catch(err) {
      console.error(`  ✗ Failed for ${t.id}:`, err.message, '\n');
    }
  }
}

testAll();
