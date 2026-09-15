# AGENTS.md

## Overview

This is Luca Sciacca's Italian personal website at https://www.lucasciacca.com/.
It is a static Hugo site with Markdown content and a monochrome top-down
laboratory minigame. Current publication is homepage-only at the user's request.
Keep archived Markdown sources and static deployment. config.toml ignoreFiles and
disableKinds retire secondary pages without deleting content. Do not restore old
navigation or routes without a new publication request.

## Homepage content (September 2026)

- data/portfolio.json owns six sections, technology rows and experience entries.
- Order: Tuurbo.ai, SEO Tester Online, Software Engineer, Backend Developer,
  DevOps, 3D Print Enthusiast. Alternate copy/illustration on desktop.
- layouts/partials/portfolio.html and pixel-scene.html render semantic HTML and
  original integer-coordinate SVG laboratory scenes. No extra game engines.
- pixel/_portfolio.scss animates scenes in steps and technology rows right,
  left, right. common.js pauses offscreen/hidden; CSS respects reduced motion.
- Technology lists supplied by the user contain 55 DevOps, 18 Software Engineer
  and 38 Nerd entries. Deduplicate globally, retaining the first category;
  REST API aliases REST. Keep JetBrains' preference note. Entries currently use
  text labels; add approved local logos under static/images/technologies/.
- Seven relevant experiences are supplied and confirmed by the user: Tuurbo.ai,
  SEO Tester Online, BreathPod, WashOut, Loom Social, Hostess.it and StudentFlat.
  Preserve Pane&Design / White Dart attribution; do not invent employment dates.
  Summaries, achievements and stacks are always visible. No experience collapses.
  Experience-specific technologies are separate from the deduplicated sliders.
- See docs/HOMEPAGE-CONTENT.md for source limitations and editing instructions.
- Run node scripts/verify-home.mjs after production build, in addition to existing checks.
- SEO: one visible home H1, ProfilePage with mainEntity Person, self-canonical home;
  404 has noindex and no canonical. Social portrait uses a summary card.
  static/llms.txt describes only published content; keep it aligned with the home.
  Run node scripts/verify-seo.mjs public. No claims of ranking gains from llms.txt.

## Stack and entry points

- Hugo Extended: local validation with 0.111.1; CI pins 0.128.0.
- Node.js 22/npm: installs Excalibur.js 0.32.0; no separate bundler.
- Hugo Pipes: SCSS compilation plus js.Build for the lazy-loaded ES module.
- Excalibur owns the game scene, actors, keyboard input, camera and clock.
- Shared UI uses vanilla JavaScript and system body fonts.
- Silkscreen Latin WOFF2 is the only active custom font, served locally.
- Formspree contact form; Google Tag Manager in production.
- GitHub Actions builds on master and deploys public/ to gh-pages.

## Structure

- config.toml: identity, menus, author information and section flags.
- content/posts/, content/projects/, content/*.md: source content.
- layouts/_default/baseof.html: shell, skip link and breadcrumbs.
- layouts/partials/head.html: SEO metadata, canonical, font and CSS.
- layouts/partials/section-hero.html: fullscreen game and HTML introduction.
- layouts/partials/game.html: semantic game UI and js.Build entry point.
- layouts/partials/article.html, project-card.html: reusable editorial cards.
- layouts/_default/, layouts/projects/: listings and detail pages.
- layouts/_default/_markup/render-heading.html: prevents duplicate body H1s,
  preserving Markdown heading anchors.
- assets/sass/main.scss imports only assets/sass/pixel/ partials.
- assets/js/common.js: navigation, theme, lazy module loading.
- assets/js/game.js: Excalibur integration, camera, input and rendering.
- assets/pixel/world.js: pure continuous movement, foot collisions and jump state.
- assets/pixel/laboratory-source.png: generated original raster, resized by Hugo.
- assets/pixel/characters/technician.js: original four-direction sprite atlas.
- assets/pixel/props.js: original Biscotto/MK3 pixel sprites and cat patrol.
- assets/pixel/objects.js: native-coordinate object descriptions and hit testing.
- assets/js/inspection.js: in-game hover/touch popups. The external object
  catalogue and select were removed at the user's request; do not restore them.
- assets/fonts/: font assets and license.
- static/: copied assets, images, robots and third-party licenses.
- scripts/verify-site.mjs: generated-site link and metadata checks.
- docs/PIXEL-LAB.md: architecture and verification notes.
- public/ and resources/: generated files, never edit manually.

The older Hilton SCSS partials and assets/js/scripts.js remain as historical
source, but are not imported by the active frontend. Do not reintroduce their
slider, icon-font or lazyload dependencies without a concrete requirement.

## Game and design constraints

The game is a personal portfolio laboratory with four rooms: Elettronica & IoT,
Stampa 3D, Videogiochi (including 2000s hardware), Sviluppo & IA. Do not bring
back Speed, SEO or Accessibility as game themes or commercial positioning.
Technical accessibility and performance remain requirements, not game topics.
Reference the broad visual language of classic
top-down adventure games; never copy their maps, sprites, logos or characters.
The user explicitly requested Excalibur.js for the game engine.
The user subsequently requested an Iron Man MK3 exhibit: its bespoke monochrome
sprite is authored in props.js, not taken from a game's assets. Preserve its exact
description “MK3: tu sai chi sono” and the cat description “Biscotto: miao!”.

Use CSS tokens in pixel/_tokens.scss for shared colors. Keep body text readable
and use the pixel font mainly for short labels and game UI. Article images can
retain their source colors; editorial card previews use grayscale treatment.

The world is 384×256 native pixels with continuous movement and rectangular
foot collisions. The background is generated raster art, not a hand-authored
tileset, and retains intermediate grays. The technician uses four tones and
24×32 cells with 12 connected poses per direction and a fixed walk baseline.
The game occupies the viewport below the menu. The entire map fits in a fixed
camera at the largest proportional scale; do not restore cover zoom. CSS pixelated
rendering is retained, allowing fractional display scales to avoid zoom steps.
Excalibur Canvas effects are cached; the background is static. Ambient devices
animate immediately at a shared 6 Hz, without collecting terminals. Shadows are
clipped against solid furniture and walls. The lower-right entrance is clear.
Lower-right furniture uses CODE_FURNITURE as the shared collision/foreground
definition; update it whenever the raster furniture moves. See docs/ROOM-REPAIR.md.
Update objects.js hotspots when objects move. Hover descriptions use a single HTML
tooltip with touch and keyboard alternatives. Biscotto's hotspot follows catPose;
the cat is decorative and non-solid. MK3 has a solid exhibit footprint. Both reuse
the existing ambient clock and reduced-motion/offscreen behavior.
Only tech objects/tools/collectibles have popups: do not reintroduce plants,
furniture, shelving or generic desk hotspots. Biscotto uses eight 24×18 poses,
12 px/s and a 12 Hz cached layer with staggered paws and pauses before turning.
Cat and player must have separate actors sorted by ground-foot Y, independent
of jump height. All shadows stay below both sprites; never group cat and armor
in one depth layer again.
Jump height is separate from the ground position and never bypasses walls.

There is no game topbar or Start/Stop control. Directional keys automatically
start/resume play while the game is visible; do not intercept keys in links,
menus, buttons or form fields. Space acts only when the canvas is focused.
Escape pauses; directional keys resume. D-pad events must release on pointer
cancel/lost capture. Stop the engine outside the viewport, on tab/window blur,
and when paused. Reduced motion disables ambient animation and runs frames only
for explicit movement or state changes. The user removed both external object
and terminal controls ("Esplora senza giocare"). Do not restore them. The game
remains optional: professional content and ordinary navigation remain in HTML.

## Commands

```sh
npm ci --ignore-scripts
hugo server --disableFastRender
hugo --minify --cleanDestinationDir
node scripts/verify-site.mjs public
node scripts/verify-game.mjs
```

The development server defaults to http://localhost:1313/. To verify a fresh
isolated output, pass --destination /absolute/temporary/path to Hugo and then
pass that directory to verify-site.mjs.

## Verification

For frontend/game changes, run the Hugo build and generated-site check. Inspect
mobile and desktop layouts in both themes, keyboard focus, input, collision
boundaries, all four collectibles, replay, and offscreen/hidden-page pause.
Check reduced-motion behavior and ensure inner pages do not fetch the game.
Do not submit the real contact form during testing.

The static checker validates internal link/asset targets, one H1, canonical,
description and JSON-LD syntax. It does not validate external services or all
accessibility behavior; browser checks are still required.

## Content and editing rules

- Preserve unrelated working-tree changes, especially user-edited Markdown.
- Keep content in Italian unless requested otherwise.
- Do not invent product offers, pricing, claims or personal biographical facts.
- Use existing Hugo templates and partials rather than replacing the framework.
- Raw HTML in trusted Markdown is enabled by Goldmark unsafe=true.
- Keep secrets out of public templates. The Formspree ID is public.
- Include package-lock.json whenever the engine dependency changes.
- Document any future runtime dependency and keep the game out of the initial
  rendering path.
- Never edit public/ or resources/ manually.

## Existing editorial TODOs

About and Elements contain demo prose and external placeholder images.
The contact page displays a .com address while its mailto target uses .it.
Some disabled sections retain demo configuration. These are existing content
issues, not authorization to invent replacement content.
