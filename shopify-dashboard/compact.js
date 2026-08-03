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

    // 1. Section-level header margin: mb-4 → mb-3
    content = content.replace(/className="flex items-center justify-between mb-4"/g, 'className="flex items-center justify-between mb-3"');

    // 2. Metrics bar / card internal padding: p-4 → p-3
    content = content.replace(/"p-4 flex items-center gap-2 w-48 font-medium"/g, '"p-3 flex items-center gap-2 w-44 font-medium"');
    content = content.replace(/"p-4 flex-1"/g, '"p-3 flex-1"');
    content = content.replace(/"p-4 text-center"/g, '"p-3 text-center"');
    content = content.replace(/"p-4 text-right"/g, '"p-3 text-right"');

    // 3. Table toolbar strip padding: p-2 border-b → already compact, leave
    // 4. Card bottom footer padding: p-4 text-center bg-gray → p-3
    content = content.replace(/"p-4 text-center bg-gray-50 rounded-b-lg border-t border-\[\#e1e3e5\]"/g, '"p-2 text-center bg-gray-50 rounded-b-lg border-t border-[#e1e3e5]"');

    // 5. Header h1 bottom margin: mb-4 → mb-3
    content = content.replace(/\bclassName="text-\[20px\] font-semibold text-\[#1a1a1a\] flex items-center gap-2"/g, 'className="text-[18px] font-semibold text-[#1a1a1a] flex items-center gap-2"');
    content = content.replace(/\bclassName="text-xl font-semibold flex items-center gap-2"/g, 'className="text-[18px] font-semibold text-[#1a1a1a] flex items-center gap-2"');

    // 6. Polaris card mb-4 → mb-3
    content = content.replace(/polaris-card" mb-4/g, 'polaris-card" mb-3');
    content = content.replace(/polaris-card mb-4/g, 'polaris-card mb-3');

    if (original !== content) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});
