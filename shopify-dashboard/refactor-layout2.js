const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./app', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Catch containers that have extra classes at the end
    content = content.replace(/className="p-8 max-w-7xl mx-auto(.*?)"/g, 'className="w-full$1"');
    content = content.replace(/className="p-8 max-w-6xl mx-auto(.*?)"/g, 'className="w-full$1"');
    content = content.replace(/className="p-8 max-w-\[1400px\] mx-auto(.*?)"/g, 'className="w-full$1"');

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
