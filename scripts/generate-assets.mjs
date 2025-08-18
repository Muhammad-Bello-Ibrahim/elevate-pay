#!/usr/bin/env node

import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.join(projectRoot, 'assets');
const sourceImage = path.join(assetsDir, 'source-logo.png');

// Asset configurations
const assets = [
  {
    name: 'icon.png',
    size: 1024,
    description: 'App icon'
  },
  {
    name: 'adaptive-icon.png', 
    size: 1024,
    description: 'Android adaptive icon'
  },
  {
    name: 'splash.png',
    size: 2048,
    description: 'Splash screen image'
  },
  {
    name: 'favicon.png',
    size: 512,
    description: 'Web favicon'
  }
];

async function generateAssets() {
  console.log('🎨 Generating ElevateX brand assets...\n');

  try {
    // Check if source image exists, if not create a placeholder
    try {
      await fs.access(sourceImage);
    } catch (error) {
      console.log('⚠️  Source logo not found, creating placeholder...');
      
      // Create a crypto-inspired placeholder logo
      const placeholder = sharp({
        create: {
          width: 1024,
          height: 1024,
          channels: 4,
          background: { r: 15, g: 23, b: 42, alpha: 1 } // Dark navy bg
        }
      });

      // Add some geometric shapes to make it look crypto-inspired
      const logoSvg = `
        <svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#06FFFF;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="1024" height="1024" fill="#0F172A"/>
          <polygon points="312,256 712,256 612,456 412,456" fill="url(#grad1)" opacity="0.9"/>
          <polygon points="212,456 612,456 512,656 312,656" fill="url(#grad1)" opacity="0.7"/>
          <polygon points="412,656 812,656 712,856 512,856" fill="url(#grad1)" opacity="0.9"/>
          <text x="512" y="920" font-family="Arial, sans-serif" font-size="80" font-weight="bold" text-anchor="middle" fill="#06FFFF">ElevateX</text>
        </svg>
      `;

      await placeholder
        .composite([{ input: Buffer.from(logoSvg), top: 0, left: 0 }])
        .png()
        .toFile(sourceImage);
      
      console.log('✅ Created placeholder logo at assets/source-logo.png\n');
    }

    // Generate all asset sizes
    for (const asset of assets) {
      const outputPath = path.join(assetsDir, asset.name);
      
      await sharp(sourceImage)
        .resize(asset.size, asset.size, {
          fit: 'contain',
          background: { r: 15, g: 23, b: 42, alpha: 0 } // Transparent or dark bg
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated ${asset.name} (${asset.size}x${asset.size}) - ${asset.description}`);
    }

    console.log('\n🎉 All ElevateX brand assets generated successfully!');
    console.log('\n📁 Generated files:');
    console.log('  assets/source-logo.png (source)');
    for (const asset of assets) {
      console.log(`  assets/${asset.name}`);
    }

  } catch (error) {
    console.error('❌ Error generating assets:', error.message);
    process.exit(1);
  }
}

// Run the script
generateAssets();