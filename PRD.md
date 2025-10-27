# Planning Guide

A modern, scroll-revealing website for The Balloon Attic, a balloon artist business in West Cork, Ireland, showcasing their creative balloon artistry with an elegant, whimsical design that reflects their brand aesthetic.

**Experience Qualities**:
1. **Whimsical** - The site should evoke the playful, creative nature of balloon artistry with floating animations and soft, pastel colors
2. **Elegant** - Professional presentation with sophisticated typography and smooth transitions that elevate balloon art as a craft
3. **Inviting** - Warm, approachable design that encourages visitors to explore the gallery and reach out for their events

**Complexity Level**: Content Showcase (information-focused)
  - Primary purpose is to showcase balloon artistry work through a gallery, provide business information, and facilitate contact through Instagram

## Essential Features

**Hero Section with Animated Balloons**
- Functionality: Display business name with CSS/JS-created balloon illustrations that float and sway
- Purpose: Create memorable first impression that captures the whimsy of balloon artistry
- Trigger: Page load
- Progression: Page loads → Animated balloons float into view → Business name fades in with elegant typography → Subtle continuous balloon animation
- Success criteria: Balloons render smoothly, match reference image colors (pastels: pink, mint, lavender, yellow), typography matches "The Balloon Attic" script style

**Gallery Section**
- Functionality: Grid of placeholder images showcasing balloon work with lightbox capability
- Purpose: Display portfolio of balloon artistry projects to attract potential clients
- Trigger: Scroll into view
- Progression: User scrolls → Gallery images reveal with stagger animation → Click image → Opens larger view → Close to return
- Success criteria: Responsive grid (3-4 columns desktop, 2 mobile), smooth reveal animations, images are easily replaceable

**About Section**
- Functionality: Editable text content describing the business with balloon emoji
- Purpose: Provide context about the balloon artist and location
- Trigger: Scroll into view
- Progression: User scrolls → Content fades in from bottom → Text displays "Balloon Artist in West Cork 🎈"
- Success criteria: Content is clearly editable in code, smooth fade-in animation

**Contact Section**
- Functionality: Instagram call-to-action with icon and link
- Purpose: Direct visitors to primary contact channel
- Trigger: Scroll into view
- Progression: User scrolls → Contact section reveals → Click Instagram button → Opens Instagram in new tab
- Success criteria: Prominent Instagram icon, clear call-to-action text, link opens correctly to @the_balloonattic

## Edge Case Handling
- **Slow connections**: Show skeleton states for images, ensure text content loads first
- **Touch devices**: Ensure balloon animations don't interfere with scrolling, optimize hover states for touch
- **Small screens**: Stack sections vertically, reduce balloon complexity on mobile if needed
- **No JavaScript**: Core content remains accessible, animations degrade gracefully
- **Long page sessions**: Ensure animations don't cause memory leaks or performance degradation

## Design Direction
The design should feel soft, whimsical, and elegant—like walking into a boutique party planning studio. It should balance playfulness (floating balloons, pastel colors) with professionalism (clean typography, smooth transitions). A minimal interface that lets the balloon work shine while providing clear navigation and contact pathways.

## Color Selection
Custom palette inspired by pastel balloon aesthetic from reference image

- **Primary Color**: Soft Rose Pink (oklch(0.90 0.05 15)) - Main brand color evoking warmth and celebration, used for primary buttons and accents
- **Secondary Colors**: 
  - Mint Green (oklch(0.88 0.08 160)) - Fresh, cheerful supporting color for secondary elements
  - Lavender (oklch(0.85 0.08 285)) - Soft, elegant accent for highlights
  - Butter Yellow (oklch(0.92 0.08 95)) - Sunny, optimistic supporting color
  - Sky Blue (oklch(0.87 0.08 220)) - Calm, trustworthy accent
- **Accent Color**: Deep Plum (oklch(0.45 0.10 320)) - Rich, sophisticated color for text and important CTAs to provide contrast against pastels
- **Foreground/Background Pairings**: 
  - Background (Blush Pink oklch(0.96 0.02 15)): Deep Plum text (oklch(0.45 0.10 320)) - Ratio 8.2:1 ✓
  - Card (White oklch(1 0 0)): Deep Plum text (oklch(0.45 0.10 320)) - Ratio 9.8:1 ✓
  - Primary (Soft Rose oklch(0.90 0.05 15)): Deep Plum text (oklch(0.45 0.10 320)) - Ratio 6.1:1 ✓
  - Secondary (Mint oklch(0.88 0.08 160)): Deep Plum text (oklch(0.45 0.10 320)) - Ratio 5.8:1 ✓
  - Accent (Deep Plum oklch(0.45 0.10 320)): White text (oklch(1 0 0)) - Ratio 9.8:1 ✓

## Font Selection
Elegant, flowing script for the business name to match the reference image's sophisticated handwritten style, paired with a clean modern sans-serif for body text to ensure readability while maintaining elegance.

- **Typographic Hierarchy**: 
  - Hero Title (Business Name): Tangerine or Dancing Script/48-72px/normal weight/loose letter spacing - Flowing script mimicking reference
  - Section Headings: Inter or Outfit/32-40px/semi-bold/tight letter spacing - Clean, modern
  - Body Text: Inter/16-18px/regular/normal letter spacing/1.6 line height - Readable, professional
  - Subtitle (West Cork): Inter/18-24px/light/wide letter spacing - Elegant, airy
  - CTA Buttons: Inter/16px/medium/slight letter spacing - Clear, actionable

## Animations
Animations should feel like gentle breezes moving balloons—light, natural, and continuous without being distracting. The balance leans toward subtle functionality with strategic moments of delight during scroll reveals.

- **Purposeful Meaning**: Floating balloons communicate the lightness and joy of the business; scroll reveals create a sense of discovery and elegance; hover effects on gallery items invite exploration
- **Hierarchy of Movement**: 
  1. Hero balloons (continuous subtle float) - Most prominent, sets brand tone
  2. Scroll-triggered section reveals (fade + translate up) - Medium priority, guides navigation
  3. Gallery image hover effects (scale + shadow) - Subtle, rewards exploration
  4. Instagram button hover (scale + glow) - Minimal, clear affordance

## Component Selection
- **Components**: 
  - Hero: Custom component with SVG/CSS balloons, uses framer-motion for float animations
  - Gallery: Card components in responsive grid with Dialog for image preview/lightbox
  - About: Card component with simple text layout
  - Contact: Card with Button (shadcn) for Instagram CTA, phosphor-icons for Instagram icon
  - Layout: Scroll-Area for smooth scrolling, motion.div wrappers for reveal animations
  
- **Customizations**: 
  - Custom balloon SVG components with varying sizes, colors (pastels), and float animations
  - Custom scroll-reveal wrapper using framer-motion's viewport detection
  - Gallery grid using CSS Grid with custom gap and responsive breakpoints
  
- **States**: 
  - Buttons: Soft shadow on default, scale(1.05) + increased shadow on hover, scale(0.98) on active, reduced opacity when disabled
  - Gallery images: Subtle border on default, scale(1.02) + lifted shadow on hover, full-screen dialog on click
  - Links: Underline on hover, color transition smooth
  
- **Icon Selection**: 
  - Instagram icon from @phosphor-icons/react (InstagramLogo) for social link - recognizable, modern
  - House icon for "attic" visual in hero if space allows
  
- **Spacing**: 
  - Section padding: py-20 md:py-32 (80-128px) - Generous vertical breathing room
  - Container max-width: max-w-6xl (1152px) - Keeps content readable
  - Gallery gap: gap-6 md:gap-8 (24-32px) - Clear visual separation
  - Card padding: p-8 md:p-12 (32-48px) - Comfortable inner spacing
  
- **Mobile**: 
  - Hero: Reduce balloon count/complexity, stack name vertically, scale down to 36-48px
  - Gallery: 2-column grid instead of 3-4, larger touch targets
  - Sections: Reduce padding to py-12 (48px), single column layout
  - Navigation: Sticky header with smooth scroll links, burger menu if needed
  - Balloons: Fewer balloons on mobile, simpler animations to maintain performance
