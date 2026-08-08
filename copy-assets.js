const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\kashy\\.gemini\\antigravity\\brain\\7d3e34c7-58d5-4b7a-b856-deed95811da1';
const destDir = 'd:\\Projects\\PASS NAVRATRI\\public\\demo';

if (!fs.existsSync(path.join(destDir, 'events'))) fs.mkdirSync(path.join(destDir, 'events'), { recursive: true });
if (!fs.existsSync(path.join(destDir, 'categories'))) fs.mkdirSync(path.join(destDir, 'categories'), { recursive: true });
if (!fs.existsSync(path.join(destDir, 'artists'))) fs.mkdirSync(path.join(destDir, 'artists'), { recursive: true });

const filesToCopy = [
  ['banner_navratri_1786178041695.jpg', 'events/banner_navratri.jpg'],
  ['banner_sunburn_1786178052907.jpg', 'events/banner_sunburn.jpg'],
  ['banner_concert_1786178067579.jpg', 'events/banner_concert.jpg'],
  
  ['poster_navratri_1786178086268.jpg', 'events/poster_navratri.jpg'],
  ['poster_sunburn_1786178101337.jpg', 'events/poster_sunburn.jpg'],
  ['poster_concert_1786178114740.jpg', 'events/poster_concert.jpg'],
  ['poster_comedy_1786178125878.jpg', 'events/poster_comedy.jpg'],
  ['poster_cultural_1786178136878.jpg', 'events/poster_cultural.jpg'],
  ['poster_bollywood_1786178148088.jpg', 'events/poster_bollywood.jpg'],

  ['cat_navratri_1786178166020.jpg', 'categories/cat_navratri.jpg'],
  ['cat_music_1786178178052.jpg', 'categories/cat_music.jpg'],
  ['cat_cultural_1786178191626.jpg', 'categories/cat_cultural.jpg'],
  ['category_festival_1786101679379.jpg', 'categories/cat_festival.jpg'],
  ['category_party_1786101727525.jpg', 'categories/cat_party.jpg'],

  ['hero_banner_1783708274528.jpg', 'artists/artist_1.jpg'],
  ['poster_bollywood_1786178148088.jpg', 'artists/artist_2.jpg'],
  ['poster_concert_1786178114740.jpg', 'artists/artist_3.jpg'],
  ['poster_comedy_1786178125878.jpg', 'artists/artist_4.jpg'],
  ['poster_cultural_1786178136878.jpg', 'artists/artist_5.jpg']
];

filesToCopy.forEach(([src, dest]) => {
  try {
    fs.copyFileSync(path.join(srcDir, src), path.join(destDir, dest));
    console.log('Copied ' + dest);
  } catch (err) {
    console.error('Failed to copy ' + dest, err);
  }
});
