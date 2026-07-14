const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Destination data with colors and icons
const destinations = [
  { name: 'Cape Town', file: 'cape-town.jpg', color1: '#1a5276', color2: '#2e86c1', icon: '🇿🇦' },
  { name: 'Paris', file: 'paris.jpg', color1: '#1a1a2e', color2: '#e94560', icon: '🇫🇷' },
  { name: 'Amsterdam', file: 'amsterdam.jpg', color1: '#ff6b35', color2: '#f7c59f', icon: '🇳🇱' },
  { name: 'Frankfurt', file: 'frankfurt.jpg', color1: '#2c3e50', color2: '#3498db', icon: '🇩🇪' },
  { name: 'Rome', file: 'rome.jpg', color1: '#8b4513', color2: '#daa520', icon: '🇮🇹' },
  { name: 'Dubai', file: 'dubai.jpg', color1: '#c9a227', color2: '#1a1a2e', icon: '🇦🇪' },
  { name: 'Mumbai', file: 'mumbai.jpg', color1: '#ff6f00', color2: '#ff8f00', icon: '🇮🇳' },
  { name: 'Delhi', file: 'delhi.jpg', color1: '#b71c1c', color2: '#e53935', icon: '🇮🇳' },
  { name: 'Bangkok', file: 'bangkok.jpg', color1: '#ffd700', color2: '#ff6b00', icon: '🇹🇭' },
  { name: 'Abu Dhabi', file: 'abu-dhabi.jpg', color1: '#1a5276', color2: '#c9a227', icon: '🇦🇪' },
  { name: 'Doha', file: 'doha.jpg', color1: '#5d1049', color2: '#8e1c6a', icon: '🇶🇦' },
  { name: 'Jeddah', file: 'jeddah.jpg', color1: '#006233', color2: '#ffffff', icon: '🇸🇦' },
  { name: 'New York', file: 'new-york.jpg', color1: '#1a237e', color2: '#283593', icon: '🇺🇸' },
  { name: 'Toronto', file: 'toronto.jpg', color1: '#b71c1c', color2: '#ffffff', icon: '🇨🇦' },
  { name: 'Kisumu', file: 'kisumu.jpg', color1: '#006400', color2: '#228b22', icon: '🇰🇪' },
];

async function generateImage(dest) {
  const svg = `
    <svg width="1536" height="1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${dest.color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${dest.color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)"/>
      <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="120" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.9">${dest.icon}</text>
      <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">${dest.name}</text>
      <text x="50%" y="72%" font-family="Arial, sans-serif" font-size="32" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.7">Kenya Airways</text>
    </svg>
  `;

  const outputPath = path.join(__dirname, 'public', dest.file);
  
  try {
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 90 })
      .toFile(outputPath);
    console.log(`✓ Generated: ${dest.file}`);
  } catch (err) {
    console.error(`✗ Failed: ${dest.file} - ${err.message}`);
  }
}

async function main() {
  console.log('Generating destination images...\n');
  
  for (const dest of destinations) {
    await generateImage(dest);
  }
  
  console.log('\nDone!');
}

main();
