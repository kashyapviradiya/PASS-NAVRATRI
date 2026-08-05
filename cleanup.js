const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'src/app/ticket/[id]');
if (fs.existsSync(target)) {
  fs.rmSync(target, { recursive: true, force: true });
  console.log('Deleted successfully');
}
