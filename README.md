# Pride Flag Highlighter

A userscript that paints LGBTQ+ identity words with the colours of their associated pride flags (gradient text or flag underlines), with hover identity labels and a settings panel.

**Based on [Queer Flag Highlighter](https://greasyfork.org/en/scripts/594233) by Yeosangist.**  
License: **CC BY-NC-SA 4.0** (same family as the original).

| | |
|---|---|
| Name | Pride Flag Highlighter |
| Version | **1.1.0** |
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
5. Optional: open `demo.html` in a browser tab to preview highlights without an extension (the demo inlines the same engine, including the settings button).

## What’s new in 1.1.0

- **Settings panel** — discreet floating pride-gradient button (bottom-right) opens Enable / Style / Hover labels / per-flag checklist. Changes apply live (highlights are cleared and the page is re-scanned).
- **Hover identity labels** — every highlight has `title` + `aria-label` set to the flag’s display name; optional CSS pill tooltip on hover (toggleable; native `title` always remains for accessibility).
- **Underline style** — keep inherited text colour and draw the flag gradient as a ~3px underline bar instead of clipped gradient text.
- **More flex-family flags** — **homoflexible** (rainbow base with a grayscale flexibility strip; inverted relative to heteroflexible) and **bicurious** (Arco-Pluris 2018 pink→white→blue).
- Every flag entry now has kebab-case `id` and Title Case `label` for settings and tooltips.

## Settings

Persisted in `localStorage` under key **`pride.flag-highlighter.settings`** (`@grant none` — no GM storage).

```js
{
  enabled: true,
  style: 'gradient' | 'underline',
  showLabels: true,          // CSS tooltips; title/aria-label always set
  disabledFlags: []          // array of flag ids, e.g. ['bear', 'leather']
}
```

UI controls:

- **Enable highlighting** — master on/off
- **Style** — Gradient text / Underline
- **Show hover labels** — CSS pill tooltips on/off
- **Flags** — scrollable checklist (checked = enabled)
- **Reset defaults** / **Close** — Escape or click-outside also closes the panel

## How it works

- Case-insensitive, whole-word Unicode matching (longest match first).
- Skips `SCRIPT`, `STYLE`, `NOSCRIPT`, form controls, `CODE`/`PRE`/`KBD`/`SAMP`, `SVG`, `MATH`, `contentEditable` regions, and the settings UI root.
- Walks the DOM with a `TreeWalker` and watches updates with a `MutationObserver`.
- Applies a `linear-gradient` via CSS custom property `--pfh-gradient` on spans with class `__pride_flag_highlight`.
- Gradient mode uses `background-clip: text`; underline mode keeps text colour and paints a bottom gradient bar.

## Identities included

**Original set (kept):** queer / LGBT(+)/LGBTQIA(+)/pride; gay / achillean / mlm; lesbian / wlw; bisexual / bi; pansexual / pan; transgender / trans; nonbinary / non-binary / enby; asexual / ace; aromantic / aro; aroace; demisexual / demi; demiromantic; genderfluid; genderqueer; agender; bigender; pangender; omnisexual / omni; polysexual; intersex; two-spirit; sapphic; questioning.

**Expanded additions:** progress pride; Philadelphia pride; polyamorous / polyam; demigirl; demiboy; demigender; transmasculine / transmasc; transfeminine / transfem; genderflux; maverique; androgyne; neutrois; graysexual / greysexual; grayromantic / greyromantic; abrosexual; multisexual; queerplatonic / qpr; butch; femme; bear; leather; straight ally / ally; oriented aroace; cupiosexual; fraysexual; lithromantic / akoiromantic; genderfae; genderfaun; genderflor; trigender; polygender; acespec; arospec; heteroflexible / heteroflex; **homoflexible / homoflex**; **bicurious / bi-curious**.

> Short ambiguous tokens like bare `poly` are **not** matched (too broad). Prefer `polysexual`, `polyamorous`, or `polyam`. Short forms such as `bi`, `pan`, `ace`, `aro`, and `enby` remain as in the original.
>
> Romantic-only flex variants (`heteroflexromantic`, `homoflexromantic`) are **not** included (no clearly documented shared palettes).

## How to add or edit flags

Edit the `FLAGS` array near the top of `pride-flag-highlighter.user.js`:

```js
{
    id: 'example',
    label: 'Example',
    words: ['example', 'ex'],
    colors: ['#FF0000', '#00FF00', '#0000FF']  // left → right stripe order
},
```

1. Add a comment naming the identity.
2. Give a unique kebab-case `id` and Title Case `label`.
3. List match words (lowercase matching is applied automatically).
4. Use widely recognized hex stripe colours; if unsure of a niche flag, skip it.
5. Prefer longer phrases over ambiguous short words when both exist.
6. Save the userscript and reload pages (or use the demo; settings changes re-scan live).

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
- Pride flag colour values follow commonly published community designs (e.g. Gilbert Baker rainbow, Daniel Quasar Progress Pride, Philadelphia More Color More Pride, PolyamProud 2022, International Bear Brotherhood, Arco-Pluris bicurious 2018, and other widely shared stripe orders). Flag designs belong to their respective creators and communities.

## Notes

- Gradient text relies on `background-clip: text` (supported in current Chromium, Firefox, and Safari).
- Very light stripes can be hard to see on light page backgrounds; try underline style, the dark demo theme, or a dark site.
- Dynamic sites (SPAs) are handled via `MutationObserver`; settings changes clear existing highlights and re-scan without a full reload.
