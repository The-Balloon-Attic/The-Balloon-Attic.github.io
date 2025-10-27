const fs = require('fs');

// Create a minimal 16x16 ICO file with balloon design
function createBasicICO() {
    // ICO file header (6 bytes)
    const header = Buffer.from([
        0x00, 0x00, // Reserved
        0x01, 0x00, // Type (1 = ICO)
        0x01, 0x00  // Number of images
    ]);
    
    // Image directory entry (16 bytes)
    const imageEntry = Buffer.from([
        0x10,       // Width (16)
        0x10,       // Height (16)
        0x00,       // Colors (0 = >256 colors)
        0x00,       // Reserved
        0x01, 0x00, // Color planes
        0x20, 0x00, // Bits per pixel (32)
        0x00, 0x04, 0x00, 0x00, // Image size (1024 bytes for 16x16x32bit)
        0x16, 0x00, 0x00, 0x00  // Offset to image data (22 bytes)
    ]);
    
    // Create a simple 16x16 RGBA bitmap
    const pixels = Buffer.alloc(16 * 16 * 4); // 16x16 pixels, 4 bytes per pixel (RGBA)
    
    // Fill with balloon pattern
    for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
            const index = (y * 16 + x) * 4;
            
            // Simple balloon shape in center
            const centerX = 8, centerY = 6;
            const dx = x - centerX, dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy * 1.5); // Ellipse
            
            if (distance < 5) {
                // Main balloon - purple
                pixels[index] = 0xb0;     // Blue
                pixels[index + 1] = 0x84; // Green  
                pixels[index + 2] = 0xa6; // Red
                pixels[index + 3] = 0xff; // Alpha
            } else if (x === 8 && y > 11 && y < 15) {
                // String
                pixels[index] = 0x8b;     // Blue
                pixels[index + 1] = 0x6a; // Green
                pixels[index + 2] = 0x85; // Red
                pixels[index + 3] = 0xff; // Alpha
            } else {
                // Transparent
                pixels[index] = 0x00;
                pixels[index + 1] = 0x00;
                pixels[index + 2] = 0x00;
                pixels[index + 3] = 0x00;
            }
        }
    }
    
    // Create bitmap info header (40 bytes)
    const bitmapHeader = Buffer.alloc(40);
    bitmapHeader.writeUInt32LE(40, 0);      // Header size
    bitmapHeader.writeInt32LE(16, 4);       // Width
    bitmapHeader.writeInt32LE(32, 8);       // Height (2x for ICO format)
    bitmapHeader.writeUInt16LE(1, 12);      // Planes
    bitmapHeader.writeUInt16LE(32, 14);     // Bits per pixel
    bitmapHeader.writeUInt32LE(0, 16);      // Compression
    bitmapHeader.writeUInt32LE(1024, 20);   // Image size
    bitmapHeader.writeInt32LE(0, 24);       // X pixels per meter
    bitmapHeader.writeInt32LE(0, 28);       // Y pixels per meter
    bitmapHeader.writeUInt32LE(0, 32);      // Colors used
    bitmapHeader.writeUInt32LE(0, 36);      // Important colors
    
    // Combine all parts
    const icoFile = Buffer.concat([
        header,
        imageEntry,
        bitmapHeader,
        pixels,
        Buffer.alloc(32) // AND mask (all transparent)
    ]);
    
    return icoFile;
}

// Generate the ICO file
try {
    const icoData = createBasicICO();
    fs.writeFileSync('favicon.ico', icoData);
    console.log('✓ Created favicon.ico file');
    
    // Also create a fallback link
    const fallbackHTML = `
<!-- Fallback favicon for browsers that don't support the generated ICO -->
<link rel="shortcut icon" href="data:image/svg+xml;base64,${Buffer.from(fs.readFileSync('favicon.svg')).toString('base64')}" type="image/x-icon">
`;
    
    fs.writeFileSync('favicon-fallback.html', fallbackHTML);
    console.log('✓ Created favicon fallback HTML');
    
} catch (error) {
    console.error('Error creating ICO file:', error);
}