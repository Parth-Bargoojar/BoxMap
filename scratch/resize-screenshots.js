/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');
const sharp = require('sharp');

const screenshotsDir = path.join(__dirname, '../public/screenshots');

async function resize() {
  // Resize desktop screenshot to 1280x720
  await sharp(path.join(screenshotsDir, 'desktop.png'))
    .resize(1280, 720, {
      fit: 'cover',
      position: 'center'
    })
    .toFile(path.join(screenshotsDir, 'desktop_resized.png'));

  // Replace old file
  const fs = require('fs');
  fs.unlinkSync(path.join(screenshotsDir, 'desktop.png'));
  fs.renameSync(path.join(screenshotsDir, 'desktop_resized.png'), path.join(screenshotsDir, 'desktop.png'));

  // Resize mobile screenshot to 720x1280
  await sharp(path.join(screenshotsDir, 'mobile.png'))
    .resize(720, 1280, {
      fit: 'cover',
      position: 'center'
    })
    .toFile(path.join(screenshotsDir, 'mobile_resized.png'));

  // Replace old file
  fs.unlinkSync(path.join(screenshotsDir, 'mobile.png'));
  fs.renameSync(path.join(screenshotsDir, 'mobile_resized.png'), path.join(screenshotsDir, 'mobile.png'));

  console.log('Screenshots resized successfully to correct PWA aspect ratios!');
}

resize().catch(err => {
  console.error('Error resizing screenshots:', err);
  process.exit(1);
});
