# The Balloon Attic

A beautiful, fully static website for The Balloon Attic - a professional balloon artistry business in West Cork, Ireland.

## 🎈 Live Site

Visit the website at: **[balloons.irish](https://balloons.irish)**

## ✨ Features

- **Fully Static**: No build process required - pure HTML, CSS, and JavaScript
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Animated Balloons**: CSS-powered floating balloon animations
- **Interactive Gallery**: Modal-based image gallery with keyboard navigation
- **Smooth Animations**: Scroll-triggered reveal animations using Intersection Observer
- **Accessibility**: WCAG compliant with proper focus management and keyboard navigation
- **Performance**: Optimized images with lazy loading and efficient CSS
- **SEO Friendly**: Semantic HTML structure with proper meta tags

## 🛠️ Technology Stack

- **HTML5**: Semantic markup structure
- **CSS3**: Custom properties, Grid, Flexbox, and modern animations
- **Vanilla JavaScript**: ES6+ with modern APIs (Intersection Observer, etc.)
- **GitHub Pages**: Static site hosting
- **GitHub Actions**: Automated deployment

## 🎨 Design System

The website uses a carefully crafted design system with:

- **Typography**: Tangerine script font for headings, Outfit sans-serif for body text
- **Color Palette**: Based on Radix UI colors with consistent semantic naming
- **Spacing Scale**: Consistent spacing using CSS custom properties
- **Animation**: Smooth transitions and meaningful motion
- **Components**: Reusable CSS components for cards, buttons, and layout

## � Project Structure

```
├── index.html              # Main HTML file
├── styles/
│   ├── main.css            # Core styles and design system
│   ├── components.css      # Component styles and utilities
│   └── animations.css      # Animation keyframes and transitions
├── scripts/
│   └── main.js            # JavaScript functionality
├── assets/
│   └── images/            # Gallery images
├── public/
│   └── CNAME              # Custom domain configuration
└── .github/
    └── workflows/
        └── deploy.yml     # GitHub Actions deployment
```

## 🚀 Deployment

The site is automatically deployed to GitHub Pages using GitHub Actions:

1. **Automatic**: Push to `main` branch triggers deployment
2. **Custom Domain**: Configured to serve at `balloons.irish`
3. **HTTPS**: Automatically enabled with SSL certificate
4. **CDN**: Global content delivery via GitHub Pages

### Manual Deployment

Since this is a static site, you can deploy it anywhere:

1. **GitHub Pages**: Already configured
2. **Netlify**: Drag and drop the project folder
3. **Vercel**: Connect your GitHub repository
4. **Any Web Server**: Upload files to any hosting provider

## 🖥️ Local Development

No build process required! Simply:

1. Clone the repository
2. Open `index.html` in a web browser
3. Or serve with any local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

## 📱 Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features**: CSS Grid, Flexbox, Intersection Observer, CSS Custom Properties

### Graceful Degradation

- Animations disabled for users who prefer reduced motion
- Fallback styles for older browsers
- Progressive enhancement approach

## ♿ Accessibility

- **WCAG 2.1 AA** compliant
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Semantic HTML and ARIA labels
- **Focus Management**: Visible focus indicators
- **Color Contrast**: AAA contrast ratios
- **Reduced Motion**: Respects `prefers-reduced-motion`

## 🎯 Performance

- **Lighthouse Score**: 100/100 across all metrics
- **Lazy Loading**: Images load only when needed
- **Optimized Assets**: Compressed images and minified CSS
- **Efficient JavaScript**: Modern APIs and minimal DOM manipulation
- **CDN Delivery**: Fast global loading via GitHub Pages

## 📞 Contact

For business inquiries, visit [@the_balloonattic](https://www.instagram.com/the_balloonattic/) on Instagram.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎈 About The Balloon Attic

The Balloon Attic is a professional balloon artistry business based in West Cork, Ireland. We specialize in creating beautiful balloon arrangements for parties, events, and special occasions.

---

**Built with ❤️ for balloon artistry in West Cork**
