# The Balloon Attic

A beautiful, fully static website for The Balloon Attic - a professional balloon artistry business in West Cork, Ireland.

## 🎈 Live Site

Visit the website at: **[theballoonattic.ie](https://theballoonattic.ie)**

`westcorkballoons.ie` and `balloons.irish` also redirect here.

## ✨ Features

- **Fully Static**: No build process required to run the site - pure HTML, CSS, and JavaScript
- **Responsive Design**: Optimized for all devices from mobile to desktop
- **Animated Balloons**: CSS-powered floating balloon animations
- **Folder Highlights**: Instagram-highlights-style balloon buttons that group the gallery by occasion (Birthdays, Christenings, Special Days, Events, Weddings, Easter, Christmas, Halloween) — this **is** the gallery, see [Gallery Folders](#-gallery-folders) below
- **Interactive Gallery**: Tap a balloon to open an immersive lightbox scoped to that occasion's photos, with keyboard navigation and swipe support
- **Smooth Animations**: Scroll-triggered reveal animations using Intersection Observer
- **Accessibility**: WCAG 2.1 AA color contrast, full keyboard support, and dialog focus management
- **Performance**: Lazy-loaded images and efficient CSS
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

## 📁 Project Structure

```
├── index.html                       # Main HTML file
├── styles/
│   ├── main.css                     # Core styles, design system, gallery + folder highlights
│   ├── components.css               # Component styles and utilities
│   └── animations.css               # Animation keyframes and transitions
├── scripts/
│   ├── main.js                      # Site + gallery JavaScript
│   └── generate-manifest.js         # Rebuilds assets/images/manifest.json from disk
├── assets/
│   └── images/
│       ├── manifest.json            # Auto-generated — don't edit by hand
│       ├── birthdays/                 } one folder per gallery
│       ├── christenings/              } highlight — drop photos
│       ├── special-days/              } straight in, see
│       ├── events/                    } "Gallery Folders" below
│       ├── weddings/                  }
│       ├── easter/                    }
│       ├── christmas/                 }
│       └── halloween/                 }
├── public/
│   └── CNAME                        # Custom domain configuration
└── .github/
    └── workflows/
        └── update-gallery-manifest.yml  # Auto-regenerates manifest.json on push
```

## 🎈 Gallery Folders

The gallery is organised into eight occasion folders under `assets/images/`,
shown as balloon "highlights" — tap one to open a full-screen lightbox with
just that occasion's photos. There's no separate "browse everything" view;
the folder highlights are the entire gallery, the same way Instagram
Highlights work.

**To add photos: drop the image file(s) straight into the matching folder and
push to `main`.** That's the entire workflow — nothing else to configure:

| Folder | Shows as |
|---|---|
| `assets/images/birthdays/` | Birthdays 🎂 |
| `assets/images/christenings/` | Christenings ⛪️ |
| `assets/images/special-days/` | Special Days 💫 |
| `assets/images/events/` | Events 🗓️🎈 |
| `assets/images/weddings/` | Weddings 🤍 |
| `assets/images/easter/` | Easter 🐣 |
| `assets/images/christmas/` | Christmas 🎄 |
| `assets/images/halloween/` | Halloween 🎃 |

A GitHub Action (`.github/workflows/update-gallery-manifest.yml`) watches for
image changes under `assets/images/`, regenerates `assets/images/manifest.js`
+ `assets/images/manifest.json` automatically, and commits them back — so the
site always reflects exactly what's in each folder, with no manual editing.
An occasion's balloon only appears once its folder has at least one photo in
it; empty folders are left out of the highlights row entirely.

To preview locally after adding photos, before pushing: run
`node scripts/generate-manifest.js` once, then just open `index.html` —
no local server needed. (The gallery reads `assets/images/manifest.js`, a
plain `<script>` tag rather than a fetched JSON file, specifically so it
still works when the page is opened directly via `file://`.)

## 🚀 Deployment

The site is automatically deployed to GitHub Pages using GitHub Actions:

1. **Automatic**: Push to `main` branch triggers deployment
2. **Custom Domain**: Configured to serve at `theballoonattic.ie` (`westcorkballoons.ie` and `balloons.irish` redirect here)
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

For business inquiries, visit [@theballoonatticwestcork](https://www.instagram.com/theballoonatticwestcork/) on Instagram.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎈 About The Balloon Attic

The Balloon Attic is a professional balloon artistry business based in West Cork, Ireland. We specialize in creating beautiful balloon arrangements for parties, events, and special occasions.

---

**Built with ❤️ for balloon artistry in West Cork**
