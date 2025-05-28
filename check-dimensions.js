const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const expectedDimensions = {
  '5.5-inch': { width: 1242, height: 2208 },
  '6.5-inch': { width: 1242, height: 2688 },
  'ipad': { width: 2048, height: 2732 },
  'android-phone': { width: 1242, height: 2688 },
  'android-7-tablet': { width: 1800, height: 2880 },
  'android-10-tablet': { width: 1800, height: 2880 }
};

async function checkDirectory(dirPath) {
  try {
    const files = await fs.readdir(dirPath);
    const imageFiles = files.filter(file => /\.(png|jpg|jpeg)$/i.test(file));
    
    for (const file of imageFiles) {
      const filePath = path.join(dirPath, file);
      const metadata = await sharp(filePath).metadata();
      const dirName = path.basename(dirPath);
      const expected = expectedDimensions[dirName];
      
      console.log(`\nChecking ${file}:`);
      console.log(`Actual dimensions: ${metadata.width} x ${metadata.height}`);
      console.log(`Expected dimensions: ${expected.width} x ${expected.height}`);
      
      if (metadata.width === expected.width && metadata.height === expected.height) {
        console.log('✅ Dimensions are correct');
      } else {
        console.log('❌ Dimensions do not match requirements');
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${dirPath}:`, error);
  }
}

async function main() {
  const baseDir = 'app-store-assets/screenshots';
  const directories = Object.keys(expectedDimensions);
  
  console.log('Checking screenshot dimensions...\n');
  
  for (const dir of directories) {
    console.log(`\n📁 Checking ${dir} directory:`);
    await checkDirectory(path.join(baseDir, dir));
  }
}

main().catch(console.error); 