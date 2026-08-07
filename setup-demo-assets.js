const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\kashy\\.gemini\\antigravity\\brain\\7d3e34c7-58d5-4b7a-b856-deed95811da1';
const publicDemoEventsDir = path.join(__dirname, 'public', 'demo', 'events');
const publicDemoCategoriesDir = path.join(__dirname, 'public', 'demo', 'categories');

// Create directories if they don't exist
if (!fs.existsSync(publicDemoEventsDir)) fs.mkdirSync(publicDemoEventsDir, { recursive: true });
if (!fs.existsSync(publicDemoCategoriesDir)) fs.mkdirSync(publicDemoCategoriesDir, { recursive: true });

const filesToCopy = [
  { src: 'demo_banner_navratri_1786101179726.jpg', dest: 'public/demo/events/banner-navratri.jpg' },
  { src: 'demo_banner_dj_1786101191047.jpg', dest: 'public/demo/events/banner-dj.jpg' },
  { src: 'demo_poster_navratri_1786101204234.jpg', dest: 'public/demo/events/poster-navratri.jpg' },
  { src: 'demo_poster_dj_1786101242672.jpg', dest: 'public/demo/events/poster-dj.jpg' },
  { src: 'demo_poster_livemusic_1786101218071.jpg', dest: 'public/demo/events/poster-livemusic.jpg' },
  { src: 'demo_poster_cultural_1786101255678.jpg', dest: 'public/demo/events/poster-cultural.jpg' },
  { src: 'demo_poster_bollywood_1786101269642.jpg', dest: 'public/demo/events/poster-bollywood.jpg' },
  { src: 'demo_poster_comedy_1786101284911.jpg', dest: 'public/demo/events/poster-comedy.jpg' },
  { src: 'category_navratri_1786101638571.jpg', dest: 'public/demo/categories/navratri.jpg' },
  { src: 'category_music_1786101652960.jpg', dest: 'public/demo/categories/music.jpg' },
  { src: 'category_cultural_1786101664796.jpg', dest: 'public/demo/categories/cultural.jpg' },
  { src: 'category_festival_1786101679379.jpg', dest: 'public/demo/categories/festival.jpg' },
  { src: 'category_party_1786101727525.jpg', dest: 'public/demo/categories/party.jpg' }
];

console.log('Copying generated demo assets to public/demo...');

filesToCopy.forEach(({ src, dest }) => {
  const sourcePath = path.join(artifactDir, src);
  const destPath = path.join(__dirname, dest);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied: ${dest}`);
  } else {
    console.error(`❌ Source file not found: ${sourcePath}`);
  }
});

console.log('Done! The assets are now ready for production deployment.');
