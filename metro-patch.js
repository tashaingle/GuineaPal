const fs = require('fs');
const path = require('path');

const metroConfigPath = path.join(
  process.cwd(),
  'node_modules',
  '@expo',
  'metro-config',
  'build',
  'serializer',
  'withExpoSerializers.js'
);

const content = fs.readFileSync(metroConfigPath, 'utf8');
const patched = content.replace(
  /require\("metro\/src\/ModuleGraph\/worker\/importLocationsPlugin"\)/g,
  'require("metro/src/ModuleGraph/worker/importAll")'
);

fs.writeFileSync(metroConfigPath, patched);
console.log('Metro successfully patched!');