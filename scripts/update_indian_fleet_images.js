import https from 'https';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fleetDir = path.join(__dirname, '..', 'public', 'images', 'fleet');

const verifiedIndianFleet = [
  {
    id: 'dzire',
    name: 'Maruti Suzuki Dzire',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/1c/Maruti_Suzuki_Dzire_VXi_VVT.JPG',
    file: 'dzire.webp'
  },
  {
    id: 'tigor',
    name: 'Tata Tigor',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/TATA_Tigor_at_Shillong_Peak_View_%28cropped%29.jpg',
    file: 'tigor.webp'
  },
  {
    id: 'honda-city',
    name: 'Honda City',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/2022_Honda_City_ZX_i-VTEC_%28India%29_front_view_%28cropped%29.jpg',
    file: 'honda-city.webp'
  },
  {
    id: 'baleno',
    name: 'Maruti Suzuki Baleno',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/2022_Maruti_Suzuki_Baleno_Alpha_%28India%29_front_view.jpg',
    file: 'baleno.webp'
  },
  {
    id: 'fronx',
    name: 'Maruti Suzuki Fronx',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/2023_Suzuki_Fronx_1.2_Delta%2B_%28India%29_front_view.png',
    file: 'fronx.webp'
  },
  {
    id: 'brezza',
    name: 'Maruti Suzuki Brezza',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/2022_Maruti_Suzuki_Brezza_ZXi%2B_%28India%29_front_view_01.png',
    file: 'brezza.webp'
  },
  {
    id: 's-cross',
    name: 'Maruti Suzuki S-Cross',
    url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Suzuki_SX4_S-CROSS_%28YB22S%29_front.JPG',
    file: 's-cross.webp'
  },
  {
    id: 'scorpio',
    name: 'Mahindra Scorpio',
    url: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Varanasi_255_-_Mahindra_Scorpio_VLX_%2844159814760%29.jpg',
    file: 'scorpio.webp'
  },
  {
    id: 'scorpio-n',
    name: 'Mahindra Scorpio-N',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Mahindra_Scorpio_zipping_by.jpg',
    file: 'scorpio-n.webp'
  },
  {
    id: 'xuv-500',
    name: 'Mahindra XUV 500',
    url: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Mahindra_XUV500.jpg',
    file: 'xuv-500.webp'
  },
  {
    id: 'bolero',
    name: 'Mahindra Bolero',
    url: 'https://upload.wikimedia.org/wikipedia/commons/d/d7/Mahindra_Bolero_ZLX.jpg',
    file: 'bolero.webp'
  },
  {
    id: 'thar',
    name: 'Mahindra Thar',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Mahindra_Thar_SUV_in_%22Red_Rage%22_color_at_Ashiana_Brahmanda%2C_East_Singbhum_India_%28Ank_Kumar%2C_Infosys_limited%29_01.jpg',
    file: 'thar.webp'
  },
  {
    id: 'ertiga',
    name: 'Maruti Suzuki Ertiga',
    url: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Suzuki_Ertiga%2C_MPV_front_view.jpg',
    file: 'ertiga.webp'
  },
  {
    id: 'innova',
    name: 'Toyota Innova',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Toyota_Innova_Crysta_2.4_Z_front_right.jpg',
    file: 'innova.webp'
  },
  {
    id: 'bmw',
    name: 'BMW',
    url: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/BMW_7_Series_%2865886%29.jpg',
    file: 'bmw.webp'
  }
];

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'GuruTravelIndianFleetBot/1.0 (contact@gurutravel.in)' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function run() {
  console.log('Downloading and converting verified Indian fleet photographs to WebP...\n');
  for (const item of verifiedIndianFleet) {
    try {
      console.log(`Processing ${item.id} (${item.name})...`);
      const buf = await downloadBuffer(item.url);
      const targetPath = path.join(fleetDir, item.file);
      
      await sharp(buf)
        .resize(1000, 667, { fit: 'cover', position: 'center' })
        .webp({ quality: 85 })
        .toFile(targetPath);
      
      const stats = fs.statSync(targetPath);
      console.log(`  ✓ Saved ${item.file} (${(stats.size / 1024).toFixed(1)} KB)`);
      await new Promise(r => setTimeout(r, 400));
    } catch (err) {
      console.error(`  ✗ Error for ${item.id}:`, err.message);
    }
  }
}

run();
