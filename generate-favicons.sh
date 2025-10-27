#!/bin/bash

# Script to generate favicon PNG files using various methods
# No external dependencies required!

echo "🎈 Balloon Attic Favicon Generator"
echo "=================================="
echo ""
echo "Choose your preferred method:"
echo "1) Node.js (generates SVG files + instructions)"
echo "2) Python (generates SVG files + download page)"
echo "3) Browser-based (open HTML generator)"
echo "4) Generate all"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "Using Node.js method..."
        if command -v node &> /dev/null; then
            node generate-favicons.js
        else
            echo "❌ Node.js not found. Please install Node.js or try option 2 or 3."
        fi
        ;;
    2)
        echo "Using Python method..."
        if command -v python3 &> /dev/null; then
            python3 generate-favicons.py
            echo ""
            echo "📱 Open 'favicon-downloads.html' in your browser to download PNG files!"
        else
            echo "❌ Python3 not found. Please install Python or try option 1 or 3."
        fi
        ;;
    3)
        echo "Opening browser-based generator..."
        if command -v open &> /dev/null; then
            open favicon-generator.html
        elif command -v xdg-open &> /dev/null; then
            xdg-open favicon-generator.html
        else
            echo "📱 Please open 'favicon-generator.html' in your browser manually."
        fi
        ;;
    4)
        echo "Generating with all available methods..."
        
        if command -v node &> /dev/null; then
            echo "Running Node.js generator..."
            node generate-favicons.js
        fi
        
        if command -v python3 &> /dev/null; then
            echo "Running Python generator..."
            python3 generate-favicons.py
        fi
        
        echo "📱 Also check out 'favicon-generator.html' and 'favicon-downloads.html' in your browser!"
        ;;
    *)
        echo "Invalid choice. Please run the script again and choose 1-4."
        exit 1
        ;;
esac

echo ""
echo "🎈 Favicon generation complete!"
echo ""
echo "Files available:"
echo "  - favicon.svg (already working!)"
echo "  - favicon-generator.html (interactive browser tool)"
echo "  - favicon-downloads.html (download page with data URIs)"
echo "  - Various SVG versions for different sizes"
echo ""
echo "💡 Tip: The SVG favicon works in modern browsers immediately!"
echo "   Generate PNG files for broader compatibility when needed."