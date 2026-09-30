# Decisions

Choices made where the brief was silent or where the current tooling differed from it. Each entry: what, and why.

## Stack

- **Next.js 16 + `proxy.ts`.** Next 16 renamed `middleware.ts` to `proxy.ts`; next-intl's middleware lives there.
- **Tailwind v4.** v4 has no JS presets, so `packages/tokens` ships `theme.css` (a Tailwind `@theme` block) instead of a preset, plus TS tokens and a React Native theme. A unit test keeps `theme.css` in sync with the TS colours.
- **React 19.2.3 in both apps.** Expo SDK 57 pins React 19.2.3; Next 16 accepts any React 19, so both use the same version to avoid duplicate React copies in the hoisted `node_modules`.
- **`node-linker=hoisted`** in `.npmrc` so Metro resolves workspace packages reliably.
- **Packages are source-only TypeScript** (no build step). Next uses `transpilePackages`; Metro compiles them directly.

## Behaviour

- **Market selector** stores the market in a `mazaq-market` cookie and in the persisted basket. Pages stay statically generated; prices render in EGP on the server and switch to the visitor's currency after hydration.
- **Other-market prices** are EGP × a per-market price index (`packages/menu/src/markets.ts`), rounded, and flagged `confirmed: false`. They are placeholders, not currency conversions.
- **Syrups:** only "Sugar-free vanilla" carries the +EGP 15 surcharge (read literally from the brief).
- **Extra shots:** +EGP 20 per shot above the drink's default (2 for most espresso drinks); fewer shots are not discounted.
- **Beans weights:** 500 g = 1.9× and 1 kg = 3.6× the 250 g price; subscriptions −10%.
- **Pay with beans** redeems 150 beans for the most expensive drink in the basket. It is disabled below 150 beans (the mock member has 112).
- **Delivery** is offered only when the basket contains beans only.
- **Beans earned** = floor(total ÷ market bean unit); EGP 10 in Egypt.
- **Seasonal and Turkish coffee** menu categories are derived from item tags, not separate data.
- **Bakes** had no items in the brief; three placeholder bakes are included and marked `placeholder: true`.
- **Menu search** (header search button) opens `/menu/search?q=…`.
- **Mock auth.** The website and app act as the signed-in member "Nour"; the app's OTP accepts any 4-digit code except 0000.
- **Order tracking** is driven by the mock API: "received" → "preparing" after one minute → "ready" at the pickup time.

## Photography

- **Unsplash search/API is blocked (401)** from this environment, so replacement photos were found through web search and every candidate was checked by eye.
- **Rejected:** the brief's "coffee beans detail" URL shows another roaster's branded bag; the "yogurt parfait" URL is panna cotta. Both were replaced.
- **Green shakshuka:** no free green shakshuka photo exists; a classic red shakshuka is used. Client to shoot or replace.
- **Halloumi & Za'atar Wrap:** no free photo; shows illustrated product art.
- Some drinks share photos (e.g. Mocha uses the cappuccino shot) — replace with a proper shoot before launch.
- The app ships 800 px copies; the web serves 1600 px originals through `next/image` (AVIF/WebP).

## Motion & accessibility

- Only the hero load animation and the card image lift animate; drawers and dialogs appear without transitions. Both animations are disabled under `prefers-reduced-motion`.
- Arabic text never gets letter-spacing (it breaks joining); the global CSS resets it under `html[lang=ar]`.
- The logo SVG is always rendered left-to-right and never mirrored.
