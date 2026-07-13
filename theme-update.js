const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let count = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // Replace hardcoded primary Red with Purple 600
    content = content.replace(/#E53935/gi, '#9333EA');
    
    // Replace hardcoded secondary Red with Purple 700
    content = content.replace(/#D32F2F/gi, '#7E22CE');
    
    // Replace hardcoded red shadows with purple shadows
    content = content.replace(/shadow-red-500/gi, 'shadow-purple-500');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        count++;
    }
});

console.log(`\n🎉 Successfully updated the theme colors to Purple in ${count} files!\n`);
