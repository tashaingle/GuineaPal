const fs = require('fs');
const path = require('path');

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(
    /const (\w+) = require\(['"]([^'"]+)['"]\);/g,
    'import $1 from \'$2\';'
  );
  fs.writeFileSync(filePath, content);
}

function processDirectory(directory) {
  fs.readdirSync(directory).forEach(file => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
      migrateFile(fullPath);
    }
  });
}

processDirectory(path.join(__dirname, 'src'));