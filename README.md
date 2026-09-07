# Prism Pride Highlighter

<p align="center">
  <img src="prism-pride-highlighter.svg" width="128" height="128" alt="Prism Pride Highlighter icon" />
</p>

<p align="center">
  Reveal LGBTQ+ identity words with their pride-flag colours — gradient text or underlines, hover labels, and a compact settings panel.
</p>

<p align="center">
  <a href="https://github.com/ExtraPotions/vivid-prism-heron/releases/latest"><img alt="Release" src="https://img.shields.io/github/v/release/ExtraPotions/vivid-prism-heron?style=flat-square&label=release" /></a>
  <a href="https://github.com/ExtraPotions/vivid-prism-heron/releases"><img alt="Downloads" src="https://img.shields.io/github/downloads/ExtraPotions/vivid-prism-heron/total?style=flat-square" /></a>
  <a href="https://github.com/ExtraPotions/vivid-prism-heron/stargazers"><img alt="Stars" src="https://img.shields.io/github/stars/ExtraPotions/vivid-prism-heron?style=flat-square" /></a>
  <a href="https://github.com/ExtraPotions/vivid-prism-heron/network/members"><img alt="Forks" src="https://img.shields.io/github/forks/ExtraPotions/vivid-prism-heron?style=flat-square" /></a>
  <a href="https://github.com/ExtraPotions/vivid-prism-heron/issues"><img alt="Issues" src="https://img.shields.io/github/issues/ExtraPotions/vivid-prism-heron?style=flat-square" /></a>
  <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="License: CC BY-NC-SA 4.0" src="https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-lightgrey?style=flat-square" /></a>
</p>

**Author:** [expDARE](https://github.com/ExtraPotions) · **Latest:** v1.4.0

The same compact prism/spark artwork is used for the userscript icon and the in-page dock button. The SVG scales cleanly for both 64×64 and 128×128 displays.

| Stat | Value |
|------|-------|
| Flag identities | **59** |
| Userscript | `pride-flag-highlighter.user.js` |
| Runs on | all sites (`*://*/*`) |
| Storage | `localStorage` only (`@grant none`) |

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. Download **`pride-flag-highlighter.user.js`** from the [latest release](https://github.com/ExtraPotions/vivid-prism-heron/releases/latest).
3. Open the file (or drag it into the extension dashboard) and save.
4. Browse as usual — matching words pick up flag colours.
5. Tampermonkey/Violentmonkey can auto-update from the GitHub release (`@downloadURL` / `@updateURL`).

Optional: open [`demo.html`](demo.html) locally to preview without an extension.

## Settings

Tap the **48×48** prism button (bottom-right; it avoids nearby corner widgets). Its compact 312px settings dock keeps the key controls close at hand, using tight 8px placement increments to sit near other floating controls. Drag the button up or down to place it where it is most useful; the position is remembered.

- **Highlight protection** — the prominent main switch enables or disables highlighting
- **Exclude this site** — skip highlights on the current host (the control remains available so you can undo it)
- Style: gradient text or underline
- Quick style buttons for gradient, underline, and soft background fill
- Intensity: subtle, balanced, or vivid
- Hover labels on/off
- Flag visibility search, tucked into a collapsible section to keep the main panel focused
- Accessibility: reduced-motion and high-contrast options

Quick style buttons sit beside the dock, so switching styles does not require opening the settings panel. Labels reposition above or align to the viewport edge when needed, and clicking a standalone highlighted word copies its identity label. Automatic dock placement checks nearby fixed, sticky, and corner controls in tight 8px increments. Existing preferences migrate from `pride.flag-highlighter.settings` to `prism.pride-highlighter.settings`. Reset defaults also restores automatic button placement. A short toast appears once after a version update (not on every page load).

## Customize flags

Edit the `FLAGS` array in the userscript:

```js
{
  id: 'example',
  label: 'Example',
  words: ['example', 'ex'],
  colors: ['#FF0000', '#00FF00', '#0000FF']
}
```

Bare `poly` is not matched — use `polysexual` / `polyamorous` / `polyam`.

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — expDARE / ExtraPotions. Full text in [`LICENSE`](LICENSE).

Includes adaptations of earlier CC BY-NC-SA material by Yeosangist (license notice only). Pride flag colours follow commonly published community designs.

## Changelog

See [GitHub Releases](https://github.com/ExtraPotions/vivid-prism-heron/releases) for downloadable versions and notes.
