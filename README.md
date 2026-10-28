# Seastem website

Company website built with React, Vite, React Router, and locally bundled Inter.

## Run locally

```cmd
npm install
npm run dev
```

Open the local address printed by Vite. For a production build, run `npm run build`; use `npm run preview` to inspect that build. Run `npm run lint` for the existing Oxlint checks.

## Deploy to Netlify

The root `netlify.toml` configures Node.js 24, the `npm run build` command, and the `dist` publish directory. No extra Netlify dependency is required for this static React/Vite site.

For a Git-connected deployment, commit `netlify.toml`, `public/_redirects`, and the existing `package-lock.json` alongside the source. If this project is inside a larger repository, set Netlify's base directory to the folder containing this `package.json`.

For a manual deployment, run `npm run build`, then upload the generated `dist` folder. Vite copies `public/_redirects` into `dist/_redirects`, so both deployment methods support direct visits and refreshes on React Router paths such as `/about` and `/contact`. Existing static files are served normally.

After deploying, open `/about` directly and refresh it to verify the route fallback. These settings follow [Netlify's Vite guidance](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/) and [SPA rewrite guidance](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/).

## Organization

- `src/main.jsx` mounts the application; `src/App.jsx` provides the router.
- `src/router.jsx` owns routes and page metadata.
- `src/layouts/MainLayout.jsx` composes the navbar, route content, footer, metadata, and scroll restoration.
- `src/pages/HomePage/index.jsx` assembles the homepage from adjacent section components.
- Every other page has its own folder and `index.jsx`.
- `src/config/navigation.js` contains shared navigation and footer items.
- Component styling uses CSS Modules; `src/index.css` contains shared tokens and accessibility defaults.
- Supplied logos are bundled from `src/assets/brand/`. The original wave PNG is retained as a design reference; the animated wave artwork is defined in `src/pages/HomePage/HeroWaves.jsx` and its CSS Module.

## Current behavior

The navbar becomes a rounded floating panel after 40px of scrolling. Below 1200px it uses a keyboard-accessible disclosure menu. The homepage contains the supplied hero; the discovery-call button opens `/contact`. Hero text enters with a short stagger. Three gradient SVG wave layers flow continuously from right to left on 32-, 26-, and 22-second loops; mobile uses slower 48-, 39-, and 33-second loops. Each layer repeats a continuous curve for a seamless loop. The waves automatically pause offscreen or in a hidden tab. Reduced-motion preferences disable the decorative animations.

About, Services, Portfolio, FAQs, and Contact are explicit coming-soon pages. Footer service links currently open `/services`. Social profiles are intentionally unlinked until official destinations are supplied. Placeholder and not-found pages use `noindex`; navigating home restores `index, follow`.

The hero responds to both viewport width and height. Its minimum height accounts for the navbar, and text, spacing, and wave height scale down on shorter laptop screens. The wave stage shares its height with the hero's reserved bottom space to keep the artwork below the discovery-call button. Small screens and enlarged text can extend the page naturally instead of clipping content to a fixed height.

The Our Approach section follows the hero. Its heading fades down into place, then the supplied icons roll inside stationary boxes and settle in reading order. Each title and description fades in after its icon settles. The grid uses four columns from 1024px, two from 600px, and one below 600px; each visible row starts independently. Animations run once per homepage mount and do not restart on scrolling back or resizing. Reduced motion and browsers without IntersectionObserver show the final icons and text immediately.

The Package section uses a navy panel with a one-time content reveal and separate decorative SVG wave layers rolling on the right. Staggered 12–18-second cycles combine horizontal travel, a vertical swell, and gentle rotation; phones use smaller movement over 14–20 seconds. The waves pause when the panel is offscreen or the browser tab is hidden, and stop for reduced-motion preferences. On phones, the artwork sits below the copy and links. “Explore Packages” opens the `/packages` coming-soon page; the secondary link opens `/contact`. The packages placeholder also uses `noindex` until its content is ready.

Testimonials and FAQs follow the Package section. All quotes and answers are explicitly marked as preview content awaiting approval. Testimonial cards travel in two seamless, screen-wide lanes: the top moves right to left and the bottom left to right, at 28px/second on desktop and 18px/second on phones. The heading and still reading grid keep the centered content width. Duplicates are decorative; each of the four original cards is exposed to assistive technology once. There is no visible reading-mode button. Hover pauses both lanes; keyboard focus on the testimonial section shows the four unique cards in a still grid until focus leaves. Animations pause offscreen and in hidden tabs.

On viewports at least 1200px wide, a shared sticky stage adds 2.4 viewport heights of reversible scroll animation when the content fits. Testimonials rise, hold, and sink behind an anchored foreground wave; the complete FAQ then follows the same sequence before the scene releases into the footer. Four SVG layers visibly roll on staggered 10/12/14/16-second loops, with separate scroll-linked offsets that diminish from the back crest to the anchored foreground. The waves fill each panel's available space and swell to 220–360px during transitions using a bottom-anchored scale transform. Compact spacing and headings below 850px tall allow shorter laptops to participate without reducing FAQ control sizes. Pinning measures the actual space below the compact navbar and reserves room for both panels, including the tallest expanded FAQ answer and adaptive wave clearance. Screens without enough room and widths below 1200px use normal flow. Resizing recalculates the layout and restores parallax automatically when the panels fit again, returning to the visible panel's reading interval. Resizing between fitting viewports preserves scroll progress. Keyboard entry temporarily uses normal flow while focus remains inside the scene. Open answers survive layout changes; visible controls and the footer retain their position, and offscreen scenes below the viewport never pull the page away from the reader.

The footer's gradient wordmark spans the full available screen width, without a desktop width cap or side margins. Its proportions scale naturally, while navigation and copyright keep their centered responsive content area.

The compact light FAQ rows use 280ms natural-height, opacity, and plus/minus transitions. All answers start closed; opening one closes the previous answer. Answers remain mounted and measurable, with closed content marked inert and hidden from assistive technology. Open-answer state survives scene changes. Reduced motion or missing observers shows static testimonials, static waves, and readable normal-flow sections; reduced motion also disables accordion transitions. The existing `/faqs` route remains unchanged.

## Before production launch

This phase is client rendered. Production hosting must serve the application for valid route requests, and should handle missing URLs with the appropriate HTTP status. The in-app not-found view alone does not set an HTTP 404. Prerendering, production redirects, final social destinations, booking integration, and the remaining page content are separate work.



