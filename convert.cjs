const fs = require('fs');
const path = require('path');
const convert = require('heic-convert');

(async () => {
  const dir = path.join(__dirname, 'public');
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.toLowerCase().endsWith('.heic')) {
      const inputPath = path.join(dir, file);
      const outputPath = path.join(dir, file.replace(/\.heic$/i, '.jpg'));
      console.log(`Converting ${file} to ${path.basename(outputPath)}...`);
      try {
        const inputBuffer = fs.readFileSync(inputPath);
        const outputBuffer = await convert({
          buffer: inputBuffer,
          format: 'JPEG',
          quality: 1
        });
        fs.writeFileSync(outputPath, outputBuffer);
        fs.unlinkSync(inputPath); // remove the old file
        console.log(`Success: ${file}`);
      } catch (err) {
        console.error(`Failed to convert ${file}:`, err);
      }
    }
  }
  console.log('Done.');
})();
