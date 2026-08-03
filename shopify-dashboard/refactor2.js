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

    // 1. Table Headers: Revert uppercase, use 12px, font-medium, color #616161
    content = content.replace(/text-\[\#616a75\] uppercase text-\[11px\] tracking-wider font-semibold/g, 'text-[#616161] text-[12px] font-medium');
    
    // 2. Table styling: 13px font size (replace text-sm on table with text-[13px])
    content = content.replace(/<table className="w-full text-sm text-left/g, '<table className="w-full text-[13px] text-left');
    
    // 3. Dark gray text for cells
    content = content.replace(/text-gray-900/g, 'text-[#1a1a1a]');
    content = content.replace(/text-gray-600/g, 'text-[#1a1a1a]'); // some cells used gray-600

    // 4. Row borders: Change tbody row border to #f1f1f1
    // Previously we changed tr borders to: border-b border-[#e1e3e5] h-[44px]
    // Let's replace that specific pattern for tbody rows
    content = content.replace(/border-b border-\[\#e1e3e5\] h-\[44px\]/g, 'border-b border-[#f1f1f1] h-[44px]');
    
    // Also change other generic row borders if they exist
    content = content.replace(/border-b border-gray-100 h-\[44px\]/g, 'border-b border-[#f1f1f1] h-[44px]');

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
