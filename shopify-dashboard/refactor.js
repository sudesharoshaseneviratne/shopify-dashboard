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

    // Remove shadow-sm
    content = content.replace(/shadow-sm/g, '');
    
    // Standardize borders
    content = content.replace(/border-gray-200/g, 'border-[#e1e3e5]');
    content = content.replace(/border-gray-100/g, 'border-[#ebebeb]');

    // Table Headers (thead row)
    content = content.replace(/text-gray-600 font-medium bg-white/g, 'text-[#616a75] uppercase text-[11px] tracking-wider font-semibold bg-white');
    content = content.replace(/text-gray-600 bg-white/g, 'text-[#616a75] uppercase text-[11px] tracking-wider font-semibold bg-white');

    // Table Rows (tbody row)
    content = content.replace(/hover:bg-gray-50 transition/g, 'h-[44px] hover:bg-gray-50 transition');
    
    // Specific container fixes if any
    content = content.replace(/bg-white border border-\[#e1e3e5\] rounded-lg/g, 'bg-white border border-[#e1e3e5] rounded-lg'); // No change but just in case
    
    // Background color updates
    content = content.replace(/bg-\[\#f1f2f4\]/g, 'bg-[#f1f1f1]');

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
