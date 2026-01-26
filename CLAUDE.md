# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for Lesson Zero, an EdTech video production company. The site is built with vanilla HTML, CSS, and JavaScript - no frameworks, no build process, no dependencies.

## Development

Since this is a static site with no build process:

- **To view**: Open `index.html` or `about.html` directly in a browser, or use a local server:
  ```bash
  python -m http.server 8000
  # or
  npx serve
  ```

- **To deploy**: Simply upload all files to a static hosting service (the site uses CDN-hosted videos)

## Architecture

### File Structure

- **HTML Pages**: `index.html` (home), `about.html`
- **Stylesheets**:
  - `css/base.css` - Shared styles (navigation, footer, buttons, typography, CSS variables)
  - `css/home.css` - Homepage-specific styles (hero video, scrolling effects, grid overlay)
  - `css/about.css` - About page-specific styles
- **JavaScript**: `js/main.js` - All interactive functionality (shared across pages)
- **Assets**: `images/` directory

### Homepage Scroll Architecture

The homepage has a sophisticated fixed-video-with-scrolling-content design that requires understanding the z-index layering system:

**Z-Index Layers (bottom to top):**
- **Layer 0**: `.hero-video-container` - Fixed background video (stays in place during scroll)
- **Layer 1**: `.hero-overlay` - Dark gradient overlay on video (fades out on scroll)
- **Layer 2**: `.grid-bg` - Blue grid overlay (fades out on scroll)
- **Layer 3**: Content sections - Scrolls over the fixed video

**Key scroll behaviors:**
- Video stays fixed in place while content scrolls over it
- Grid overlay (`grid-bg`) and video overlay (`hero-overlay`) fade out as user scrolls
- Video brightness increases when overlays fade (controlled by `.hero-video.bright` class)
- Scroll indicator opacity controlled via CSS variable `--scroll-indicator-opacity`

These scroll effects are implemented in `main.js` in the `handleScroll()` function (lines 82-111).

### Intersection Observer Pattern

The site uses Intersection Observer API extensively for performance and animations:

1. **Content fade-in animations**: Elements with `[data-animate]` attribute fade in when scrolled into view
2. **Video performance**: Videos in `.video-card` elements automatically pause when off-screen

Both observers are configured in `main.js` (lines 123-174).

### Navigation Behavior

Navigation has two states managed via classes:
- `.transparent` - Used on homepage when at top of page (background: transparent)
- `.solid` - Used when scrolled down or on non-homepage pages (background: dark blue with blur)

The JavaScript detects which page you're on by checking for `.hero` element existence.

### CSS Architecture

**CSS Variables** are defined in `:root` in `base.css`:
- Color palette: `--blue-deep`, `--blue-dark`, `--blue-mid`, `--blue-bright`, `--blue-light`
- Accent colors: `--yellow-highlight`, `--yellow-accent`
- Background colors: `--white`, `--cream`

**Typography system**:
- Headings use `rockwell, serif` (Adobe Fonts)
- Body text uses `Archivo, sans-serif` (Google Fonts fallback available)
- Responsive sizing uses `clamp()` for fluid typography

**Shared components** (in `base.css`):
- `.section-label` - Small uppercase labels
- `.section-heading` - Main headings
- `.section-text` - Body paragraphs
- `.cta-button` - Yellow call-to-action buttons
- `.highlight` - Yellow background text highlight

### Mobile Navigation

Mobile menu slides in from the right side:
- Hamburger toggle: `.mobile-menu-toggle`
- Close button: `.mobile-menu-close`
- Menu slides in by adding `.active` class to `.nav-menu`
- Menu closes when clicking outside, on links, or the close button

## Design Patterns to Follow

### When adding new pages:

1. Link `css/base.css` first, then page-specific CSS
2. Link `js/main.js` at the end of `<body>`
3. Add `.solid` class to `.main-nav` for non-homepage pages
4. Use `[data-animate]` attribute on elements that should fade in when scrolled into view
5. Follow the established navigation structure with active states

### When adding new sections:

1. Use semantic HTML5 section elements
2. Start with `.section-label`, followed by `.section-heading`, then `.section-text`
3. Use `.highlight` span for yellow-highlighted words
4. Wrap emphasized words in `<span class="highlight">word</span>` for yellow background
5. Add `[data-animate]` to containers that should fade in on scroll

### Z-Index Guidelines:

- **0-2**: Background elements (video, overlays, grid)
- **3**: Main content sections
- **10**: Fixed navigation
- Higher values reserved for modals/overlays (if added)

## External Dependencies

- **Adobe Fonts**: Rockwell serif font family (loaded via Typekit)
- **Google Fonts**: Archivo sans-serif (fallback)
- **Video CDN**: Background videos hosted on `lessonstep-videos.b-cdn.net`
- **Sample videos**: Portfolio grid uses Google's sample videos temporarily

## Performance Considerations

- Videos automatically pause when off-screen (via Intersection Observer)
- Scroll event listeners use `{ passive: true }` for better scroll performance
- Hero video is darkened/desaturated to reduce visual noise
- Fixed positioning used sparingly to avoid performance issues
