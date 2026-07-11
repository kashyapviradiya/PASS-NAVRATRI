const { execSync } = require('child_process');

try {
  console.log('Running typecheck...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  
  console.log('Running build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Success!');
} catch (error) {
  console.error('Build failed!');
  process.exit(1);
}
