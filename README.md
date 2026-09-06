# Pride Flag Highlighter

Userscript by **Pride** ([ExtraPotions/vivid-prism-heron](https://github.com/ExtraPotions/vivid-prism-heron)) that paints LGBTQ+ identity words with their pride-flag colours — gradient text or underlines, hover labels, and a settings panel.

| | |
|---|---|
| Name | Pride Flag Highlighter |
| Version | **1.1.5** |
| Author | Pride |
| Repo | [ExtraPotions/vivid-prism-heron](https://github.com/ExtraPotions/vivid-prism-heron) |
| Namespace | `pride.flag-highlighter` |
| Match | `*://*/*` |
| Run at | `document-start` |
| Grant | none |

## Install (Tampermonkey / Violentmonkey)

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. Open the dashboard → **Create a new script** (or **+**).
3. Paste `pride-flag-highlighter.user.js`, or open / drag-and-drop the file.
4. Save, then browse — matching words pick up flag colours.
5. Optional: open `demo.html` locally to preview without an extension.

## Settings

Floating GitHub-icon button (bottom-right by default; auto-dodges other fixed/sticky UI) opens the panel. Stored in `localStorage` as `pride.flag-highlighter.settings`:

```js
{
  enabled: true,
  style: 'gradient' | 'underline',
  showLabels: true,       // CSS pill tooltips (title/aria-label always set)
  disabledFlags: []       // flag ids to skip, e.g. ['bear', 'leather']
}
```

- **Enable** — master on/off  
- **Style** — gradient text or underline  
- **Hover labels** — CSS tooltips on/off  
- **Flags** — per-identity checklist  
- Escape / click-outside / **Close** dismisses; **Reset** restores defaults. Changes re-scan the page live.

## How it works

- Case-insensitive whole-word Unicode matching (longest match first)
- Skips `SCRIPT` / `STYLE` / form controls / `CODE` / `PRE` / `contentEditable` / the settings UI
- `TreeWalker` + `MutationObserver` for static and dynamic pages
- Flag colours via `--pfh-gradient` on `__pride_flag_highlight` spans

## Identities

Includes a broad set of orientation, gender, ace/aro, relationship, and community terms (progress / Philadelphia pride, flex-family labels, bicurious, and many more). Each entry has an `id`, display `label`, match `words`, and stripe `colors`.

Bare `poly` is not matched (too ambiguous) — use `polysexual`, `polyamorous`, or `polyam`. Short forms like `bi`, `pan`, `ace`, `aro`, and `enby` are matched.

## Add or edit flags

In `pride-flag-highlighter.user.js`, edit the `FLAGS` array:

```js
{
    id: 'example',
    label: 'Example',
    words: ['example', 'ex'],
    colors: ['#FF0000', '#00FF00', '#0000FF']  // left → right
},
```

Prefer documented stripe orders; skip niche flags when colours are unclear. Keep `demo.html` in sync if you use the local preview.

## Icon

Gradient **Aa** on charcoal (`icon.png`, `icon-128.png`, `icon-64.png`). Userscript `@icon` and the settings FAB use the 128px asset on `main`.

## Files

| File | Purpose |
|------|---------|
| `pride-flag-highlighter.user.js` | Installable userscript |
| `demo.html` | Local preview (engine inlined) |
| `icon.png` / `icon-128.png` / `icon-64.png` | Script icon |
| `README.md` | This document |

## Changelog

### 1.1.5
- Settings FAB shows the GitHub `icon-128.png` (circular clip, charcoal fallback) instead of a rainbow fill
- Collision-aware FAB placement: auto-dodges other fixed/sticky UI (prefer up, then left)

### 1.1.4
- README and project framing cleaned up for ExtraPotions / Pride

### 1.1.3
- Fix icon aspect ratio (pad to square instead of stretching)

### 1.1.2
- Ship gradient Aa icon and `@icon` metadata

### 1.1.1
- Internal code cleanup

### 1.1.0
- Settings panel, hover labels, underline style, homoflexible + bicurious

### 1.0.x
- Initial ExtraPotions release and early flag expansions

## License

**CC BY-NC-SA 4.0** — Pride / ExtraPotions.

This project includes adaptations of earlier CC BY-NC-SA material by Yeosangist; that notice is retained for license compliance only. Pride flag stripe colours follow commonly published community designs and belong to their respective creators and communities.

## Notes

- Gradient text needs `background-clip: text` (current Chromium, Firefox, Safari).
- Light stripes can wash out on light pages — try underline style or a dark theme.
- SPAs are covered by `MutationObserver`; settings changes clear and re-scan without a full reload.
