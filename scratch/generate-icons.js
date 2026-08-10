/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '../public');
const appDir = path.join(__dirname, '../app');

// Ensure public icons directory exists
if (!fs.existsSync(path.join(publicDir, 'icons'))) {
  fs.mkdirSync(path.join(publicDir, 'icons'), { recursive: true });
}

// 1. Standard SVG Icon content (rounded square with box glyph)
const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="128" fill="#4F46E5"/>
  <path d="M256 80 L96 160 L96 352 L256 432 L416 352 L416 160 Z" fill="none" stroke="#FFFFFF" stroke-width="24" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="M96 160 L256 240 L416 160" fill="none" stroke="#FFFFFF" stroke-width="24" stroke-linejoin="round"/>
  <path d="M256 240 L256 432" fill="none" stroke="#FFFFFF" stroke-width="24" stroke-linejoin="round"/>
  <path d="M176 120 L336 200" fill="none" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/>
</svg>`;

// 2. Maskable SVG Icon content (bleed to edges with safe-zone glyph)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" fill="#4F46E5"/>
  <g transform="translate(102, 102) scale(0.6)">
    <path d="M256 80 L96 160 L96 352 L256 432 L416 352 L416 160 Z" fill="none" stroke="#FFFFFF" stroke-width="24" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M96 160 L256 240 L416 160" fill="none" stroke="#FFFFFF" stroke-width="24" stroke-linejoin="round"/>
    <path d="M256 240 L256 432" fill="none" stroke="#FFFFFF" stroke-width="24" stroke-linejoin="round"/>
    <path d="M176 120 L336 200" fill="none" stroke="#FFFFFF" stroke-width="16" stroke-linecap="round"/>
  </g>
</svg>`;

async function generate() {
  const standardBuffer = Buffer.from(standardSvg);
  const maskableBuffer = Buffer.from(maskableSvg);

  // Write SVGs
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);
  fs.writeFileSync(path.join(appDir, 'icon.svg'), standardSvg);

  // Apple touch icon (180x180)
  await sharp(standardBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  fs.copyFileSync(path.join(publicDir, 'apple-touch-icon.png'), path.join(appDir, 'apple-icon.png'));

  // Standard PNG Icons
  await sharp(standardBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icons/icon-192.png'));
  await sharp(standardBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icons/icon-512.png'));

  // Maskable PNG Icons
  await sharp(maskableBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-maskable-192.png'));
  await sharp(maskableBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-maskable-512.png'));

  // Generate favicon.ico (multi-size: 16x16, 32x32, 48x48)
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map(size => sharp(standardBuffer).resize(size, size).png().toBuffer())
  );
  
  // Custom simple ICO encoder for Node
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // ICO type
  icoHeader.writeUInt16LE(sizes.length, 4); // Number of images

  const icoDirs = [];
  const icoImages = [];
  let currentOffset = 6 + sizes.length * 16;

  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const buffer = pngBuffers[i];
    
    const icoDir = Buffer.alloc(16);
    icoDir.writeUInt8(size, 0); // Width
    icoDir.writeUInt8(size, 1); // Height
    icoDir.writeUInt8(0, 2); // Color palette
    icoDir.writeUInt8(0, 3); // Reserved
    icoDir.writeUInt16LE(1, 4); // Color planes
    icoDir.writeUInt16LE(32, 6); // Bits per pixel
    icoDir.writeUInt32LE(buffer.length, 8); // Size of image data
    icoDir.writeUInt32LE(currentOffset, 12); // Offset to image data

    icoDirs.push(icoDir);
    icoImages.push(buffer);
    currentOffset += buffer.length;
  }

  const faviconBuffer = Buffer.concat([icoHeader, ...icoDirs, ...icoImages]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), faviconBuffer);

  console.log('Successfully generated all brand icons!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
