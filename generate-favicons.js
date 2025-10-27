#!/usr/bin/env node

const fs = require('fs');

// Create a simple PNG file generator without external dependencies
// This creates a base64-encoded PNG for each favicon size

function createBalloonFaviconBase64(size) {
    // Create a simple balloon favicon as base64 PNG data
    // This is a simplified approach that works without canvas dependencies
    
    const colors = {
        mainBalloon: '#b084a6',
        backgroundBalloon: '#f5c2b8',
        highlight: '#ffffff',
        mainStroke: '#8b6a85',
        backgroundStroke: '#d4a48a'
    };
    
    // For this implementation, we'll create a simple SVG and convert it
    // This is more reliable than trying to use canvas without proper setup
    const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32">
        <!-- Background balloons (behind) - slightly smaller and pink -->
        <!-- Left background balloon -->
        <ellipse cx="10" cy="12" rx="5.5" ry="6.5" fill="${colors.backgroundBalloon}" stroke="${colors.backgroundStroke}" stroke-width="0.4"/>
        <ellipse cx="8.5" cy="9.5" rx="1.5" ry="2" fill="rgba(255,255,255,0.5)"/>
        <path d="M10 18.5 Q9 20.5 10 22 Q11 23.5 10 24.5" stroke="${colors.backgroundStroke}" stroke-width="0.8" fill="none" stroke-linecap="round"/>
        
        ${size >= 32 ? `<!-- Right background balloon -->
        <ellipse cx="22" cy="12" rx="5.5" ry="6.5" fill="${colors.backgroundBalloon}" stroke="${colors.backgroundStroke}" stroke-width="0.4"/>
        <ellipse cx="23.5" cy="9.5" rx="1.5" ry="2" fill="rgba(255,255,255,0.5)"/>
        <path d="M22 18.5 Q23 20.5 22 22 Q21 23.5 22 24.5" stroke="${colors.backgroundStroke}" stroke-width="0.8" fill="none" stroke-linecap="round"/>` : ''}
        
        <!-- Main balloon (front) - purple -->
        <ellipse cx="16" cy="14" rx="7" ry="8.5" fill="${colors.mainBalloon}" stroke="${colors.mainStroke}" stroke-width="0.5"/>
        <ellipse cx="13.5" cy="11.5" rx="2" ry="2.5" fill="rgba(255,255,255,0.6)"/>
        <path d="M16 22.5 Q14 25 16 27 Q18 29 16 30" stroke="${colors.mainStroke}" stroke-width="1" fill="none" stroke-linecap="round"/>
    </svg>`;
    
    return svgContent;
}

function createICOContent() {
    // Create a simple ICO file header for a 16x16 favicon
    // This is a minimal ICO file structure
    const icoHeader = Buffer.from([
        0x00, 0x00, // Reserved
        0x01, 0x00, // Type (1 = ICO)
        0x01, 0x00, // Number of images
        // Image entry
        0x10,       // Width (16)
        0x10,       // Height (16)
        0x00,       // Colors (0 = >256 colors)
        0x00,       // Reserved
        0x01, 0x00, // Color planes
        0x20, 0x00, // Bits per pixel (32)
        0x00, 0x00, 0x00, 0x00, // Image size (will be calculated)
        0x16, 0x00, 0x00, 0x00  // Offset to image data
    ]);
    
    return icoHeader;
}

async function generateFavicons() {
    try {
        console.log('Generating favicon files...');
        
        // Generate SVG files for different sizes
        const sizes = [
            { size: 16, filename: 'favicon-16x16.svg' },
            { size: 32, filename: 'favicon-32x32.svg' },
            { size: 180, filename: 'apple-touch-icon.svg' }
        ];
        
        sizes.forEach(({ size, filename }) => {
            const svgContent = createBalloonFaviconBase64(size);
            fs.writeFileSync(filename, svgContent);
            console.log(`✓ Created ${filename}`);
        });
        
        // Create a simple ICO file (basic structure)
        const icoContent = createICOContent();
        fs.writeFileSync('favicon.ico', icoContent);
        console.log('✓ Created favicon.ico (basic structure)');
        
        // Create instructions file
        const instructions = `
# Favicon Files Generated

The following files have been created:
- favicon-16x16.svg
- favicon-32x32.svg  
- apple-touch-icon.svg
- favicon.ico (basic structure)

## Converting SVG to PNG

To convert these SVG files to PNG format, you can:

1. **Using online tools:**
   - Visit https://cloudconvert.com/svg-to-png
   - Upload each SVG file and convert to PNG
   - Download with the correct naming

2. **Using browser (recommended):**
   - Open favicon-generator.html in your browser
   - Click "Generate All Favicons"
   - Right-click each canvas and save as PNG

3. **Using other tools:**
   - GIMP, Photoshop, or any image editor
   - Open SVG files and export as PNG

## File naming:
- favicon-16x16.svg → favicon-16x16.png
- favicon-32x32.svg → favicon-32x32.png
- apple-touch-icon.svg → apple-touch-icon.png
`;
        
        fs.writeFileSync('FAVICON_INSTRUCTIONS.md', instructions);
        console.log('✓ Created FAVICON_INSTRUCTIONS.md');
        
        console.log('\n🎈 Favicon generation complete!');
        console.log('Use the browser-based generator (favicon-generator.html) for best PNG results.');
        
    } catch (error) {
        console.error('Error generating favicons:', error.message);
        console.log('\nFallback: Use favicon-generator.html in your browser to generate PNG files.');
    }
}

// Run the generator
generateFavicons();