# MirrorPhone launch page

## Draft and design direction

**Small screen. Big presence.** A native Mac app for bringing a USB-connected iPhone or iPad onto your desktop, styling its presentation, and keeping screenshots or recordings locally.

The page uses a warm editorial direction: ivory paper, generous spacing, oversized Manrope typography, quiet ruled divisions and an electric mint accent. The central composition is an original illustration of a floating mirrored device on a Mac desktop, paired with its physical phone. The repeated artwork makes the app's purpose immediately legible without exposing private screenshots or borrowing Apple assets.

The content follows the intended visitor journey:

1. Understand the USB device-to-Mac pitch and see an illustrative preview.
2. Try dark/silver frames, sand/mint backdrops and screen-only presentation.
3. Explore desktop presentation, source-resolution PNG capture and MP4 recording with optional device audio.
4. Learn the cable, unlock/trust and connection setup.
5. Understand local capture, development status and compatibility boundaries.
6. Follow the public launch project for updates.

Public copy is based on the implemented app baseline and upcoming release plan. No public download, App Store availability, price, universal compatibility, latency or performance guarantee is asserted. Artwork and app UI are explicitly illustrative. The public site links only to the separate public launch repository, not to the private app source.

## Local preview

The site has no build dependencies. From the app repository root:

```sh
python3 -m http.server 4173 --directory site
```

Open <http://localhost:4173>. Files use relative paths so the site works under the GitHub Pages project URL.

In the dedicated public repository, these files live at the repository root. Preview that copy with `python3 -m http.server 4173` from its root.

## Hosting

Publish the contents of this directory to the dedicated public `tech-grandpa/mirrorphone-site` repository and serve its root with GitHub Pages. The canonical URL is <https://tech-grandpa.github.io/mirrorphone-site/>. `.nojekyll` keeps the static assets unchanged.

Only launch-page files belong in that public repository. The app repository, source, internal plans, device captures and test media remain private.

## Assets and accessibility

All artwork and icons are original CSS/SVG. Manrope is self-hosted in `assets/fonts/` with its SIL Open Font License included. The page uses semantic headings, native expandable FAQ entries, keyboard focus outlines, a skip link, accessible preview toggles and an announced preview state. Motion respects reduced-motion preferences. The illustration is decorative and described as a single image; it is not a functioning phone interface.

## Before launch

Update the availability and compatibility copy when release information is confirmed. Replace the GitHub follow CTA with the verified release destination if desired. `assets/social.svg` is the original social composition; `assets/social.png` is the raster export used by the Open Graph image metadata for broad social-platform support.
