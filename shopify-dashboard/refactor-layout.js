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

    // We want to replace `<div className="p-8 max-w-7xl mx-auto">` 
    // or `<div className="p-8 max-w-6xl mx-auto">`
    // or `<div className="max-w-7xl mx-auto">`
    // with `<div className="w-full max-w-full">` or just `<div className="w-full">`
    
    // Regular expression to catch variations of the container class
    content = content.replace(/className="p-8 max-w-[a-zA-Z0-9-\[\]]+ mx-auto"/g, 'className="w-full"');
    content = content.replace(/className="max-w-[a-zA-Z0-9-\[\]]+ mx-auto"/g, 'className="w-full"');

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
