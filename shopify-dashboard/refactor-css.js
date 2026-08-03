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

    // 1. Cards
    content = content.replace(/bg-white border border-\[\#e1e3e5\] rounded-lg/g, 'polaris-card');
    
    // 2. Tables
    content = content.replace(/w-full text-\[13px\] text-left/g, 'polaris-table');
    content = content.replace(/w-full text-sm text-left/g, 'polaris-table'); // fallback

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
