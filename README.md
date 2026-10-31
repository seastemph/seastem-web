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

The navbar becomes a rounded floating panel after 40px of scrolling. Below 1200px it uses a keyboard-accessible disclosure menu. The footer gradient wordmark spans the full available screen width; navigation and copyright retain their centered responsive content area.

The hero responds to viewport width and height, with space reserved below its copy and discovery-call link for the artwork. Following the supplied video reference, connected navy, white, cyan, and pale-blue SVG bands roll smoothly from right to left. The slightly taller waves use coordinated 22-second passes and gentle, staggered 8–14-second swells anchored at the bottom, giving each layer ocean-like movement while keeping the wave full across the screen. Short screens and enlarged text extend the page naturally instead of clipping content.

Our Approach uses single icons in stationary navy boxes. Icons and their text fade together over 500ms, staggered by 150ms within each visible row. Its heading keeps a short downward fade. The grid uses four columns from 1024px, two from 600px, and one below 600px; each row starts independently and does not replay on scrolling back or resizing.

The Package section retains its navy panel, one-time content reveal, and separate decorative SVG waves on the right. Its staggered 12–18-second cycles combine horizontal travel, vertical swell, and gentle rotation; phones use smaller movement over 14–20 seconds and place the artwork below the copy. “Explore Packages” opens the /packages placeholder; the secondary link opens /contact.

Testimonials and FAQs always use normal document flow, without parallax, pinned stages, extra scroll distance, or automatic scroll corrections. Their headings, testimonial lanes, and FAQ questions fade in independently over 500ms once per homepage mount. Keyboard focus reveals the relevant section immediately.

The testimonial carousel has two screen-wide lanes: top right-to-left and bottom left-to-right, at 28px/second on desktop and 18px/second on phones. Cards are 360px/280px wide, capped for narrow screens. Two-line quote previews expand vertically over 280ms on hover or through individual Read more / Read less controls. Long quotes scroll inside the card while the sample label, attribution, and controls remain visible. The expansion cap follows available viewport height and a 22rem target, allowing enlarged controls to take the space they need. Both lanes pause during reading and resume from the same position. Keyboard entry shows the four unique cards in a still grid, retained while a keyboard-open quote is being read. Escape closes the quote and restores disclosure focus. Decorative copies do not add keyboard stops or duplicate accessible testimonials. There is no section-wide Read all button and no testimonial wave.

The compact FAQ rows keep one answer open at a time and use 280ms natural-height, opacity, and plus/minus transitions. Answers remain mounted, with closed content inert and hidden from assistive technology. Open cards, FAQ answers, and completed reveals survive resizing. One full-width decorative wave sits below the accordion, before the footer, on staggered 18/22/26/30-second loops. It occupies its own space and never covers answers.

Decorative autoplay pauses offscreen and in hidden tabs. Reduced motion shows static artwork and testimonial cards with immediate disclosures. Missing observers leave sections readable and testimonials in a static grid. All testimonial quotes and FAQ answers remain clearly marked preview content awaiting approval.

The discovery-call link opens /contact. About, Services, Packages, Portfolio, FAQs, and Contact remain coming-soon pages. Footer service links open /services; social labels remain unlinked until official destinations are supplied. Placeholder and not-found routes use noindex, while navigating home restores index, follow.

## Before production launch

This phase is client rendered. Production hosting must serve the application for valid route requests, and should handle missing URLs with the appropriate HTTP status. The in-app not-found view alone does not set an HTTP 404. Prerendering, production redirects, final social destinations, booking integration, and the remaining page content are separate work.
