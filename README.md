# Pride Flag Highlighter

A userscript that paints LGBTQ+ identity words with the colours of their associated pride flags (gradient text).

**Based on [Queer Flag Highlighter](https://greasyfork.org/en/scripts/594233) by Yeosangist.**  
License: **CC BY-NC-SA 4.0** (same family as the original).

| | |
|---|---|
| Name | Pride Flag Highlighter |
| Version | 1.0.1 |
| Author | Pride |
| Namespace | `pride.flag-highlighter` |
| Match | `*://*/*` |
| Run at | `document-start` |
| Grant | none |

## Install (Tampermonkey / Violentmonkey)

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/) in your browser.
2. Open the extension dashboard → **Create a new script** (or **+**).
3. Delete the template, then paste the full contents of `pride-flag-highlighter.user.js`, **or** use **Open** / drag-and-drop the `.user.js` file if your manager supports local install.
4. Save. Visit any page — matching words should show flag-coloured text.
5. Optional: open `demo.html` in a browser tab to preview highlights without an extension (the demo inlines the same engine).

## How it works

- Case-insensitive, whole-word Unicode matching (longest match first).
- Skips `SCRIPT`, `STYLE`, `NOSCRIPT`, form controls, `CODE`/`PRE`/`KBD`/`SAMP`, `SVG`, `MATH`, and `contentEditable` regions.
- Walks the DOM with a `TreeWalker` and watches updates with a `MutationObserver`.
- Applies a `linear-gradient` via CSS custom property `--pfh-gradient` on spans with class `__pride_flag_highlight`.

## Identities included

**Original set (kept):** queer / LGBT(+)/LGBTQIA(+)/pride; gay / achillean / mlm; lesbian / wlw; bisexual / bi; pansexual / pan; transgender / trans; nonbinary / non-binary / enby; asexual / ace; aromantic / aro; aroace; demisexual / demi; demiromantic; genderfluid; genderqueer; agender; bigender; pangender; omnisexual / omni; polysexual; intersex; two-spirit; sapphic; questioning.

**Expanded additions:** progress pride; Philadelphia pride; polyamorous / polyam; demigirl; demiboy; demigender; transmasculine / transmasc; transfeminine / transfem; genderflux; maverique; androgyne; neutrois; graysexual / greysexual; grayromantic / greyromantic; abrosexual; multisexual; queerplatonic / qpr; butch; femme; bear; leather; straight ally / ally; oriented aroace; cupiosexual; fraysexual; lithromantic / akoiromantic; genderfae; genderfaun; genderflor; trigender; polygender; acespec; arospec; heteroflexible / heteroflex.

> Short ambiguous tokens like bare `poly` are **not** matched (too broad). Prefer `polysexual`, `polyamorous`, or `polyam`. Short forms such as `bi`, `pan`, `ace`, `aro`, and `enby` remain as in the original.

## How to add or edit flags

Edit the `FLAGS` array near the top of `pride-flag-highlighter.user.js`:

```js
{
    words: ['example', 'ex'],
    colors: ['#FF0000', '#00FF00', '#0000FF']  // left → right stripe order
},
```

1. Add a comment naming the identity.
2. List match words (lowercase matching is applied automatically).
3. Use widely recognized hex stripe colours; if unsure of a niche flag, skip it.
4. Prefer longer phrases over ambiguous short words when both exist.
5. Save the userscript and reload pages.

The demo page duplicates the same `FLAGS` + engine in a `<script>` block — after editing the userscript, refresh that inline copy in `demo.html` (or regenerate it) if you want the demo to stay in sync.

## Files

| File | Purpose |
|------|---------|
| `pride-flag-highlighter.user.js` | Installable userscript |
| `demo.html` | Local preview (engine inlined; no extension needed) |
| `README.md` | This document |

## Attribution & license

- **Based on Queer Flag Highlighter by Yeosangist** (GreasyFork script 594233).
- This derivative is released under **CC BY-NC-SA 4.0**.
- Pride flag colour values follow commonly published community designs (e.g. Gilbert Baker rainbow, Daniel Quasar Progress Pride, Philadelphia More Color More Pride, PolyamProud 2022, International Bear Brotherhood, and other widely shared stripe orders). Flag designs belong to their respective creators and communities.

## Notes

- Gradient text relies on `background-clip: text` (supported in current Chromium, Firefox, and Safari).
- Very light stripes can be hard to see on light page backgrounds; try the dark demo theme or a dark site.
- Dynamic sites (SPAs) are handled via `MutationObserver`.
