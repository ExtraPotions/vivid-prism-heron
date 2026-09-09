# Prism Pride Highlighter

<p align="center"><img src="prism-pride-highlighter.svg" width="128" height="128" alt="Prism Pride Highlighter"></p>

Reveal LGBTQ+ identity words with their pride-flag colours, hover labels and a compact settings menu.

**Version 2.1.7** · By [expDARE](https://github.com/ExtraPotions)

## Features

- 59 flag identities with gradient text, underline and soft-fill styles.
- Quick style buttons and subtle, balanced or vivid intensity.
- Highlight protection master switch and per-site exclusions.
- Searchable flag visibility controls.
- Optional hover labels that adapt to viewport edges; click a standalone highlighted word to copy its identity name.
- Optional visible-content-only highlighting for large pages.
- Updates to highlighting as page content changes.
- Compact 312px menu with accessible toggle switches, keyboard focus and responsive positioning.
- Reduced-motion and high-contrast options that respect system preferences.
- Remembered settings and launcher position, with Reset defaults.
- JSON export and import for backing up or moving settings.
- Versioned settings migrate automatically, with validation for imported backups.
- Collapsible diagnostics report the page, enabled identities, highlight count, processing time and captured errors.
- **Alt+G** opens or closes the menu; the current version is shown in the footer.
- A launcher coordination protocol publishes ownership, companion priority, preferred placement and occupied space to avoid primary controls.
- The menu shortcut can be changed or disabled, with collision warnings for other declared launchers.
- Optional quiet update checks use release metadata only and never download executable code.

Ambiguous bare words such as “pride”, “bear”, “ally”, “bi”, “pan”, “ace”, “aro”, “trans”, “leather” and “poly” are not matched. Explicit identities and phrases such as “bisexual”, “pansexual”, “transgender”, “bear pride”, “straight ally” and “polysexual” remain supported.

## Controls and companion plugins

Click the 48px rounded-square prism button or press **Alt+G** to open settings. **Escape**, **Alt+G** or an outside click closes the menu. Tab moves through its visible controls. Drag the button vertically to save its preferred position.

Prism recognizes other plugins made by expDARE and respects their positioning. **Amazon Dark Pattern Blocker and Theme Pickers always take primary position.** Prism makes room when its launcher overlaps a primary control, while keeping its saved preference.

## Install

Install Tampermonkey or Violentmonkey, then open the [latest userscript](https://github.com/ExtraPotions/vivid-prism-heron/releases/latest/download/pride-flag-highlighter.user.js). Update the existing entry to retain preferences and reload your pages.

Icon downloads: [64×64 SVG](prism-pride-highlighter-64.svg) · [128×128 SVG](prism-pride-highlighter-128.svg).

## License

[CC BY-NC-SA 4.0](LICENSE) — expDARE / ExtraPotions. Includes adaptations of earlier CC BY-NC-SA material by Yeosangist (license notice only). Pride flag colours follow commonly published community designs.
