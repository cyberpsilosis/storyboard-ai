const { execSync } = require('child_process');

try {
  // Force Next.js build
  execSync('npx next build', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
} 