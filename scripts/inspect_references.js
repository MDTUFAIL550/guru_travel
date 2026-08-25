import fs from 'fs';

function findUrls(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const matches = content.match(/https:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|avif)(?:\?[^\s"'<>]*)?/gi) || [];
  return [...new Set(matches)];
}

const boleroImgs = findUrls('C:/Users/razat/.gemini/antigravity/brain/e184a3f0-4fff-4e21-b5b4-a64bb48e7ce9/.system_generated/steps/260/content.md');
console.log('--- BOLERO IMAGES ---');
console.log(boleroImgs.slice(0, 5));

const ertigaImgs = findUrls('C:/Users/razat/.gemini/antigravity/brain/e184a3f0-4fff-4e21-b5b4-a64bb48e7ce9/.system_generated/steps/264/content.md');
console.log('--- ERTIGA IMAGES ---');
console.log(ertigaImgs.slice(0, 5));

const scorpioImgs = findUrls('C:/Users/razat/.gemini/antigravity/brain/e184a3f0-4fff-4e21-b5b4-a64bb48e7ce9/.system_generated/steps/268/content.md');
console.log('--- SCORPIO CLASSIC IMAGES ---');
console.log(scorpioImgs.slice(0, 5));

const scorpioNImgs = findUrls('C:/Users/razat/.gemini/antigravity/brain/e184a3f0-4fff-4e21-b5b4-a64bb48e7ce9/.system_generated/steps/272/content.md');
console.log('--- SCORPIO-N IMAGES ---');
console.log(scorpioNImgs.slice(0, 5));

const tigorImgs = findUrls('C:/Users/razat/.gemini/antigravity/brain/e184a3f0-4fff-4e21-b5b4-a64bb48e7ce9/.system_generated/steps/276/content.md');
console.log('--- TIGOR IMAGES ---');
console.log(tigorImgs.slice(0, 5));
