import https from 'https';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fleetDir = path.join(__dirname, '..', 'public', 'images', 'fleet');

const fleetQueries = [
  { id: 'dzire', query: 'Maruti Suzuki Dzire front', file: 'dzire.webp' },
  { id: 'tigor', query: 'Tata Tigor', file: 'tigor.webp' },
  { id: 'honda-city', query: 'Honda City sedan front', file: 'honda-city.webp' },
  { id: 'baleno', query: 'Suzuki Baleno front', file: 'baleno.webp' },
  { id: 'fronx', query: 'Suzuki Fronx', file: 'fronx.webp' },
  { id: 'brezza', query: 'Maruti Vitara Brezza', file: 'brezza.webp' },
  { id: 's-cross', query: 'Suzuki SX4 S-Cross front', file: 's-cross.webp' },
  { id: 'scorpio', query: 'Mahindra Scorpio', file: 'scorpio.webp' },
  { id: 'scorpio-n', query: 'Mahindra Scorpio-N', file: 'scorpio-n.webp' },
  { id: 'xuv-500', query: 'Mahindra XUV500', file: 'xuv-500.webp' },
  { id: 'bolero', query: 'Mahindra Bolero', file: 'bolero.webp' },
  { id: 'thar', query: 'Mahindra Thar', file: 'thar.webp' },
  { id: 'ertiga', query: 'Suzuki Ertiga front', file: 'ertiga.webp' },
  { id: 'innova', query: 'Toyota Innova Crysta', file: 'innova.webp' },
  { id: 'bmw', query: 'BMW 5 Series sedan front', file: 'bmw.webp' }
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'GuruTravelImageBot/1.0 (contact@gurutravel.in)' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'GuruTravelImageBot/1.0 (contact@gurutravel.in)' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadBuffer(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

async function findWikiImage(searchQuery) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=10&gsrsearch=${encodeURIComponent(searchQuery)}&prop=imageinfo&iiprop=url|mime|size`;
  const data = await fetchJson(url);
  if (!data.query || !data.query.pages) return null;
  const pages = Object.values(data.query.pages);
  for (const page of pages) {
    if (page.imageinfo && page.imageinfo[0] && page.imageinfo[0].url) {
      const info = page.imageinfo[0];
      const title = page.title.toLowerCase();
      // Filter out interior, rear, badge, logo, diagram, map
      if (title.includes('interior') || title.includes('rear') || title.includes('logo') || title.includes('badge') || title.includes('tail') || title.includes('engine')) {
        continue;
      }
      return info.url;
    }
  }
  return null;
}

async function main() {
  console.log('Searching and fetching Wikimedia fleet images...');
  for (const item of fleetQueries) {
    try {
      console.log(`\nProcessing ${item.id} (${item.query})...`);
      const imgUrl = await findWikiImage(item.query);
      if (!imgUrl) {
        console.log(`  No candidate found for ${item.id}`);
        continue;
      }
      console.log(`  Found URL: ${imgUrl}`);
      const buf = await downloadBuffer(imgUrl);
      const targetPath = path.join(fleetDir, item.file);
      await sharp(buf)
        .resize(800, 533, { fit: 'cover', position: 'center' })
        .webp({ quality: 85 })
        .toFile(targetPath);
      console.log(`  -> Saved to ${targetPath}`);
    } catch (err) {
      console.error(`  Error processing ${item.id}:`, err.message);
    }
  }
}

main();
