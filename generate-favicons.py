#!/usr/bin/env python3

import os
import base64

def create_balloon_svg(size):
    """Create a balloon SVG for the given size"""
    
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 32 32">
    <!-- Background balloons (behind) - slightly smaller and pink -->
    <!-- Left background balloon -->
    <ellipse cx="10" cy="12" rx="5.5" ry="6.5" fill="#f5c2b8" stroke="#d4a48a" stroke-width="0.4"/>
    <ellipse cx="8.5" cy="9.5" rx="1.5" ry="2" fill="rgba(255,255,255,0.5)"/>
    <path d="M10 18.5 Q9 20.5 10 22 Q11 23.5 10 24.5" stroke="#d4a48a" stroke-width="0.8" fill="none" stroke-linecap="round"/>'''
    
    if size >= 32:
        svg_content += '''
    <!-- Right background balloon -->
    <ellipse cx="22" cy="12" rx="5.5" ry="6.5" fill="#f5c2b8" stroke="#d4a48a" stroke-width="0.4"/>
    <ellipse cx="23.5" cy="9.5" rx="1.5" ry="2" fill="rgba(255,255,255,0.5)"/>
    <path d="M22 18.5 Q23 20.5 22 22 Q21 23.5 22 24.5" stroke="#d4a48a" stroke-width="0.8" fill="none" stroke-linecap="round"/>'''
    
    svg_content += '''
    <!-- Main balloon (front) - purple -->
    <ellipse cx="16" cy="14" rx="7" ry="8.5" fill="#b084a6" stroke="#8b6a85" stroke-width="0.5"/>
    <ellipse cx="13.5" cy="11.5" rx="2" ry="2.5" fill="rgba(255,255,255,0.6)"/>
    <path d="M16 22.5 Q14 25 16 27 Q18 29 16 30" stroke="#8b6a85" stroke-width="1" fill="none" stroke-linecap="round"/>
</svg>'''
    
    return svg_content

def create_data_uri_png(svg_content):
    """Create a data URI for the SVG (can be used as PNG alternative)"""
    svg_b64 = base64.b64encode(svg_content.encode('utf-8')).decode('utf-8')
    return f"data:image/svg+xml;base64,{svg_b64}"

def generate_favicons():
    """Generate favicon files using Python"""
    
    print("🎈 Generating balloon favicon files using Python...")
    
    try:
        # Generate SVG files for different sizes
        sizes = [
            (16, 'favicon-16x16.svg'),
            (32, 'favicon-32x32.svg'), 
            (180, 'apple-touch-icon.svg')
        ]
        
        generated_files = []
        data_uris = {}
        
        for size, filename in sizes:
            svg_content = create_balloon_svg(size)
            
            # Write SVG file
            with open(filename, 'w') as f:
                f.write(svg_content)
            generated_files.append(filename)
            
            # Create data URI
            png_filename = filename.replace('.svg', '.png')
            data_uris[png_filename] = create_data_uri_png(svg_content)
            
            print(f"✓ Created {filename}")
        
        # Create an HTML file with data URIs for easy PNG download
        html_content = f'''<!DOCTYPE html>
<html>
<head>
    <title>Balloon Favicon Downloads</title>
    <style>
        body {{ font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #f2d5d8; }}
        .favicon-item {{ margin: 20px 0; padding: 20px; background: white; border-radius: 10px; text-align: center; }}
        img {{ border: 2px solid #b084a6; border-radius: 5px; margin: 10px; }}
        a {{ display: inline-block; background: #b084a6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 5px; }}
        a:hover {{ background: #8b6a85; }}
    </style>
</head>
<body>
    <h1>🎈 Balloon Attic Favicons</h1>
    <p>Right-click on images below and "Save image as..." or click download links:</p>
    
    <div class="favicon-item">
        <h3>16x16 Favicon</h3>
        <img src="{data_uris['favicon-16x16.png']}" alt="16x16 favicon" width="32" height="32">
        <br>
        <a href="{data_uris['favicon-16x16.png']}" download="favicon-16x16.png">Download favicon-16x16.png</a>
    </div>
    
    <div class="favicon-item">
        <h3>32x32 Favicon</h3>
        <img src="{data_uris['favicon-32x32.png']}" alt="32x32 favicon" width="64" height="64">
        <br>
        <a href="{data_uris['favicon-32x32.png']}" download="favicon-32x32.png">Download favicon-32x32.png</a>
    </div>
    
    <div class="favicon-item">
        <h3>180x180 Apple Touch Icon</h3>
        <img src="{data_uris['apple-touch-icon.png']}" alt="Apple touch icon" width="90" height="90">
        <br>
        <a href="{data_uris['apple-touch-icon.png']}" download="apple-touch-icon.png">Download apple-touch-icon.png</a>
    </div>
    
    <div class="favicon-item">
        <h3>Instructions:</h3>
        <ol style="text-align: left;">
            <li>Right-click on any image above and select "Save image as..."</li>
            <li>Use the exact filename shown (favicon-16x16.png, etc.)</li>
            <li>Upload these PNG files to your website root directory</li>
            <li>The SVG favicon (favicon.svg) is already in place</li>
        </ol>
    </div>
</body>
</html>'''
        
        with open('favicon-downloads.html', 'w') as f:
            f.write(html_content)
        generated_files.append('favicon-downloads.html')
        print("✓ Created favicon-downloads.html")
        
        # Create simple ICO placeholder
        ico_placeholder = "# Favicon ICO placeholder - use favicon.svg or generate PNG files\n"
        with open('favicon.ico', 'w') as f:
            f.write(ico_placeholder)
        print("✓ Created favicon.ico placeholder")
        
        print(f"\n🎈 Successfully generated {len(generated_files)} favicon files!")
        print("\nGenerated files:")
        for file in generated_files:
            print(f"  - {file}")
        
        print(f"\n📱 Open 'favicon-downloads.html' in your browser to download PNG files!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Fallback: Use favicon-generator.html in your browser.")

if __name__ == "__main__":
    generate_favicons()