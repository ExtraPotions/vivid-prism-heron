// ==UserScript==
// @name         Prism Pride Highlighter
// @namespace    prism.pride-highlighter
// @version      1.3.0
// @description  Reveals queer- and LGBTQ+-related words with their associated pride flag colours.
// @author       expDARE
// @license      CC BY-NC-SA 4.0
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @icon         https://raw.githubusercontent.com/ExtraPotions/vivid-prism-heron/main/prism-pride-highlighter.svg
// @downloadURL  https://github.com/ExtraPotions/vivid-prism-heron/releases/latest/download/pride-flag-highlighter.user.js
// @updateURL    https://github.com/ExtraPotions/vivid-prism-heron/releases/latest/download/pride-flag-highlighter.user.js
// ==/UserScript==

/*
 * Prism Pride Highlighter — expDARE / ExtraPotions
 * License: CC BY-NC-SA 4.0
 * License notice: includes adaptations of earlier CC BY-NC-SA material by Yeosangist.
 */

(() => {
    'use strict';

    /*
     * ============================================================
     * WORDS / FLAGS
     * ============================================================
     *
     * Add, remove, or modify entries here.
     *
     * Each entry has:
     *   id: kebab-case identifier (settings / disabledFlags)
     *   label: Title Case display name (hover tooltips / a11y)
     *   words: words to match
     *   colors: flag colours, from left to right (stripe order)
     *
     * The script uses a linear gradient for multi-colour flags.
     * Bare "poly" is omitted (too ambiguous); use polysexual /
     * polyamorous / polyam instead.
     */

    const FLAGS = [

        // Rainbow / LGBTQ+ (Gilbert Baker six-stripe)
        {
            id: 'rainbow',
            label: 'Rainbow / LGBTQ+',
            words: ['queer', 'lgbtq', 'lgbtq+', 'lgbt', 'lgbt+', 'lgbtqia', 'lgbtqia+', 'pride'],
            colors: [
                '#E40303',
                '#FF8C00',
                '#FFED00',
                '#008026',
                '#004DFF',
                '#750787'
            ]
        },

        // Progress Pride (Daniel Quasar; chevron approximated L→R)
        {
            id: 'progress-pride',
            label: 'Progress Pride',
            words: ['progress pride', 'progresspride', 'inclusive pride'],
            colors: [
                '#000000',
                '#613915',
                '#74D7EE',
                '#FFAFC8',
                '#FFFFFF',
                '#E40303',
                '#FF8C00',
                '#FFED00',
                '#008026',
                '#004DFF',
                '#750787'
            ]
        },

        // Philadelphia Pride / More Color More Pride
        {
            id: 'philadelphia-pride',
            label: 'Philadelphia Pride',
            words: ['philadelphia pride', 'philly pride', 'more color more pride'],
            colors: [
                '#000000',
                '#784F17',
                '#E40303',
                '#FF8C00',
                '#FFED00',
                '#008026',
                '#004DFF',
                '#750787'
            ]
        },

        // Gay men
        {
            id: 'gay',
            label: 'Gay',
            words: ['gay', 'achillean', 'mlm'],
            colors: [
                '#078D70',
                '#26CEAA',
                '#98E8C1',
                '#DDDDDD',
                '#7BADE2',
                '#5049CC',
                '#3D1A78'
            ]
        },

        // Lesbian
        {
            id: 'lesbian',
            label: 'Lesbian',
            words: ['lesbian', 'wlw'],
            colors: [
                '#D52D00',
                '#EF7627',
                '#FF9A56',
                '#DDDDDD',
                '#D162A4',
                '#B55690',
                '#A30262'
            ]
        },

        // Bisexual
        {
            id: 'bisexual',
            label: 'Bisexual',
            words: ['bisexual', 'bi'],
            colors: [
                '#D60270',
                '#D60270',
                '#9B4F96',
                '#0038A8',
                '#0038A8'
            ]
        },

        // Pansexual
        {
            id: 'pansexual',
            label: 'Pansexual',
            words: ['pansexual', 'pan'],
            colors: [
                '#FF218C',
                '#FFD800',
                '#21B1FF'
            ]
        },

        // Transgender
        {
            id: 'transgender',
            label: 'Transgender',
            words: ['transgender', 'trans'],
            colors: [
                '#5BCEFA',
                '#F5A9B8',
                '#DDDDDD',
                '#F5A9B8',
                '#5BCEFA'
            ]
        },

        // Transmasculine / transmasc
        {
            id: 'transmasculine',
            label: 'Transmasculine',
            words: ['transmasculine', 'transmasc'],
            colors: [
                '#FF8ABD',
                '#CDF5FE',
                '#9AEBFF',
                '#74DFFF',
                '#9AEBFF',
                '#CDF5FE',
                '#FF8ABD'
            ]
        },

        // Transfeminine / transfem
        {
            id: 'transfeminine',
            label: 'Transfeminine',
            words: ['transfeminine', 'transfem', 'transfemme'],
            colors: [
                '#73DEFF',
                '#FFE0ED',
                '#FFB5D5',
                '#FF8CBE',
                '#FFB5D5',
                '#FFE0ED',
                '#73DEFF'
            ]
        },

        // Non-binary
        {
            id: 'non-binary',
            label: 'Non-binary',
            words: ['nonbinary', 'non-binary', 'enby'],
            colors: [
                '#FCF434',
                '#DDDDDD',
                '#9C59D1',
                '#2C2C2C'
            ]
        },

        // Asexual
        {
            id: 'asexual',
            label: 'Asexual',
            words: ['asexual', 'ace'],
            colors: [
                '#000000',
                '#A3A3A3',
                '#DDDDDD',
                '#800080'
            ]
        },

        // Aromantic
        {
            id: 'aromantic',
            label: 'Aromantic',
            words: ['aromantic', 'aro'],
            colors: [
                '#3DA542',
                '#A7D379',
                '#DDDDDD',
                '#A9A9A9',
                '#000000'
            ]
        },

        // AroAce
        {
            id: 'aroace',
            label: 'AroAce',
            words: ['aroace', 'aromantic asexual', 'aromantic-asexual', 'aromantic/asexual'],
            colors: [
                '#DD8A00',
                '#E9CC07',
                '#DDDDDD',
                '#65B0DD',
                '#213C57'
            ]
        },

        // Oriented aroace
        {
            id: 'oriented-aroace',
            label: 'Oriented Aroace',
            words: ['oriented aroace', 'oriented-aroace', 'orientedaroace'],
            colors: [
                '#B2B2B2',
                '#D8D8D8',
                '#FFFFFF',
                '#A8D0E6',
                '#3D7EA6'
            ]
        },

        // Acespec (asexual spectrum umbrella)
        {
            id: 'acespec',
            label: 'Acespec',
            words: ['acespec', 'ace-spec', 'ace spectrum', 'asexual spectrum'],
            colors: [
                '#000000',
                '#A3A3A3',
                '#FFFFFF',
                '#CB7FCC',
                '#800080'
            ]
        },

        // Arospec (aromantic spectrum umbrella)
        {
            id: 'arospec',
            label: 'Arospec',
            words: ['arospec', 'aro-spec', 'aro spectrum', 'aromantic spectrum'],
            colors: [
                '#3DA542',
                '#A7D379',
                '#FFFFFF',
                '#E89EC8',
                '#C94C9C'
            ]
        },

        // Demisexual
        {
            id: 'demisexual',
            label: 'Demisexual',
            words: ['demisexual', 'demi'],
            colors: [
                '#000000',
                '#DDDDDD',
                '#6E0070',
                '#D2D2D2'
            ]
        },

        // Demiromantic
        {
            id: 'demiromantic',
            label: 'Demiromantic',
            words: ['demiromantic'],
            colors: [
                '#39A94A',
                '#B5DF9B',
                '#DDDDDD',
                '#A9A9A9',
                '#000000'
            ]
        },

        // Graysexual / greysexual
        {
            id: 'graysexual',
            label: 'Graysexual',
            words: ['graysexual', 'greysexual', 'gray-asexual', 'grey-asexual'],
            colors: [
                '#740195',
                '#B2B2B2',
                '#FFFFFF',
                '#B2B2B2',
                '#740195'
            ]
        },

        // Grayromantic / greyromantic
        {
            id: 'grayromantic',
            label: 'Grayromantic',
            words: ['grayromantic', 'greyromantic', 'gray-aromantic', 'grey-aromantic'],
            colors: [
                '#087D16',
                '#B2B2B2',
                '#FFFFFF',
                '#B2B2B2',
                '#087D16'
            ]
        },

        // Cupiosexual
        {
            id: 'cupiosexual',
            label: 'Cupiosexual',
            words: ['cupiosexual', 'cupio'],
            colors: [
                '#FCA9C4',
                '#FFFFFF',
                '#CBCBCB',
                '#161616'
            ]
        },

        // Fraysexual
        {
            id: 'fraysexual',
            label: 'Fraysexual',
            words: ['fraysexual', 'fray'],
            colors: [
                '#6B8EC2',
                '#94CEF1',
                '#FFFFFF',
                '#636363'
            ]
        },

        // Lithromantic / akoiromantic
        {
            id: 'lithromantic',
            label: 'Lithromantic',
            words: ['lithromantic', 'akoiromantic', 'lithro', 'akoi'],
            colors: [
                '#FF2B66',
                '#FF9146',
                '#FFF152',
                '#FFFFFF',
                '#000000'
            ]
        },

        // Genderfluid
        {
            id: 'genderfluid',
            label: 'Genderfluid',
            words: ['genderfluid', 'gender-fluid'],
            colors: [
                '#FF75A2',
                '#DDDDDD',
                '#BE18D6',
                '#000000',
                '#333EBD'
            ]
        },

        // Genderflux
        {
            id: 'genderflux',
            label: 'Genderflux',
            words: ['genderflux'],
            colors: [
                '#F47694',
                '#F2A3B9',
                '#CECECE',
                '#7CE0F7',
                '#3ECDF9',
                '#FFF48E'
            ]
        },

        // Genderqueer
        {
            id: 'genderqueer',
            label: 'Genderqueer',
            words: ['genderqueer', 'gender-queer'],
            colors: [
                '#B57EDC',
                '#DDDDDD',
                '#4A8123'
            ]
        },

        // Agender
        {
            id: 'agender',
            label: 'Agender',
            words: ['agender'],
            colors: [
                '#000000',
                '#B9B9B9',
                '#DDDDDD',
                '#B8F483',
                '#DDDDDD',
                '#B9B9B9',
                '#000000'
            ]
        },

        // Bigender
        {
            id: 'bigender',
            label: 'Bigender',
            words: ['bigender'],
            colors: [
                '#C479D9',
                '#EDA5CD',
                '#D8D8D8',
                '#A4E8D8',
                '#6ADEC9'
            ]
        },

        // Pangender
        {
            id: 'pangender',
            label: 'Pangender',
            words: ['pangender'],
            colors: [
                '#fdf48d',
                '#f3b79c',
                '#fac3ef',
                '#DDDDDD'
            ]
        },

        // Demigirl
        {
            id: 'demigirl',
            label: 'Demigirl',
            words: ['demigirl'],
            colors: [
                '#7F7F7F',
                '#C4C4C4',
                '#FFAEC9',
                '#FFFFFF',
                '#FFAEC9',
                '#C4C4C4',
                '#7F7F7F'
            ]
        },

        // Demiboy
        {
            id: 'demiboy',
            label: 'Demiboy',
            words: ['demiboy'],
            colors: [
                '#7F7F7F',
                '#C4C4C4',
                '#9AD9EB',
                '#FFFFFF',
                '#9AD9EB',
                '#C4C4C4',
                '#7F7F7F'
            ]
        },

        // Demigender
        {
            id: 'demigender',
            label: 'Demigender',
            words: ['demigender'],
            colors: [
                '#7F7F7F',
                '#C4C4C4',
                '#FBFF74',
                '#FFFFFF',
                '#FBFF74',
                '#C4C4C4',
                '#7F7F7F'
            ]
        },

        // Maverique
        {
            id: 'maverique',
            label: 'Maverique',
            words: ['maverique'],
            colors: [
                '#FFF344',
                '#FFFFFF',
                '#F49622'
            ]
        },

        // Androgyne
        {
            id: 'androgyne',
            label: 'Androgyne',
            words: ['androgyne', 'androgynous'],
            colors: [
                '#FE76A2',
                '#9832CC',
                '#00B8E7'
            ]
        },

        // Neutrois
        {
            id: 'neutrois',
            label: 'Neutrois',
            words: ['neutrois'],
            colors: [
                '#FFFFFF',
                '#1F9E49',
                '#000000',
                '#1F9E49',
                '#FFFFFF'
            ]
        },

        // Trigender
        {
            id: 'trigender',
            label: 'Trigender',
            words: ['trigender'],
            colors: [
                '#FF95C5',
                '#9588C8',
                '#6DE08D',
                '#9588C8',
                '#FF95C5'
            ]
        },

        // Polygender
        {
            id: 'polygender',
            label: 'Polygender',
            words: ['polygender'],
            colors: [
                '#000000',
                '#B8B8B8',
                '#ED698A',
                '#F8E68F',
                '#75D7EF',
                '#698AEC'
            ]
        },

        // Genderfae (fluidity without masculine genders)
        {
            id: 'genderfae',
            label: 'Genderfae',
            words: ['genderfae', 'genderdoe'],
            colors: [
                '#97C8A4',
                '#C3DEAE',
                '#F9FACB',
                '#FFFFFF',
                '#F9B8C5',
                '#D595E4',
                '#B18AE5'
            ]
        },

        // Genderfaun (fluidity without feminine genders)
        {
            id: 'genderfaun',
            label: 'Genderfaun',
            words: ['genderfaun', 'genderfawn'],
            colors: [
                '#FCD6A4',
                '#FFF09B',
                '#FAF9CD',
                '#FFFFFF',
                '#8BC8EF',
                '#9F9DE0',
                '#A07CC7'
            ]
        },

        // Genderflor (fluidity without binary genders)
        {
            id: 'genderflor',
            label: 'Genderflor',
            words: ['genderflor'],
            colors: [
                '#A5D6A7',
                '#C8F0C0',
                '#F2F2C8',
                '#FFFFFF',
                '#F2C8F0',
                '#E0A8E8',
                '#C890D0'
            ]
        },

        // Omnisexual
        {
            id: 'omnisexual',
            label: 'Omnisexual',
            words: ['omnisexual', 'omni'],
            colors: [
                '#FF9A4D',
                '#FF53BF',
                '#DDDDDD',
                '#625FFF',
                '#1F9BFF'
            ]
        },

        // Polysexual (bare "poly" omitted — too ambiguous)
        {
            id: 'polysexual',
            label: 'Polysexual',
            words: ['polysexual'],
            colors: [
                '#F61CB9',
                '#07D569',
                '#1C92F5'
            ]
        },

        // Polyamorous (2022 PolyamProud / Howell redesign stripes)
        {
            id: 'polyamorous',
            label: 'Polyamorous',
            words: ['polyamorous', 'polyam', 'polyamory'],
            colors: [
                '#009FE3',
                '#E50051',
                '#340C46'
            ]
        },

        // Heteroflexible (Library.LGBT: grayscale hetero base + rainbow strip)
        {
            id: 'heteroflexible',
            label: 'Heteroflexible',
            words: ['heteroflexible', 'hetero-flexible', 'heteroflex'],
            colors: [
                '#000000',
                '#51504D',
                '#7B7B7A',
                '#E40303',
                '#FF8C00',
                '#FFED00',
                '#008026',
                '#004DFF',
                '#750787',
                '#B0B1B0',
                '#DEDEDE',
                '#EEEEEE'
            ]
        },

        // Homoflexible — visually inverse of heteroflexible (rainbow base +
        // grayscale flexibility strip in the middle). Distinct from
        // Library.LGBT’s shared palette listing; design mirrors the
        // common inverted flag.
        {
            id: 'homoflexible',
            label: 'Homoflexible',
            words: ['homoflexible', 'homo-flexible', 'homoflex'],
            colors: [
                '#E40303',
                '#FF8C00',
                '#FFED00',
                '#000000',
                '#51504D',
                '#B0B1B0',
                '#EEEEEE',
                '#008026',
                '#004DFF',
                '#750787'
            ]
        },

        // Bicurious (Arco-Pluris 2018 / commonly documented 7-stripe
        // pink→white→blue palette)
        {
            id: 'bicurious',
            label: 'Bicurious',
            words: ['bicurious', 'bi-curious', 'bi curious'],
            colors: [
                '#F347F8',
                '#F787FA',
                '#FDC6FD',
                '#FFFFFF',
                '#C6E0FD',
                '#76B5FA',
                '#2D8CF7'
            ]
        },

        // Abrosexual
        {
            id: 'abrosexual',
            label: 'Abrosexual',
            words: ['abrosexual', 'abro'],
            colors: [
                '#65C286',
                '#B4E4CC',
                '#FFFFFF',
                '#E796B7',
                '#D9446E'
            ]
        },

        // Multisexual
        {
            id: 'multisexual',
            label: 'Multisexual',
            words: ['multisexual', 'multi'],
            colors: [
                '#FF3B7B',
                '#FF8EC8',
                '#FFFFFF',
                '#7BB8FF',
                '#3B7BFF'
            ]
        },

        // Intersex
        {
            id: 'intersex',
            label: 'Intersex',
            words: ['intersex'],
            colors: [
                '#FFD800',
                '#7902AA',
                '#FFD800'
            ]
        },

        // Two-spirit
        {
            id: 'two-spirit',
            label: 'Two-Spirit',
            words: ['two-spirit', 'two spirit', 'twospirit'],
            colors: [
                '#D62828',
                '#F77F00',
                '#FCBF49',
                '#2A9D8F',
                '#277DA1',
                '#7B2CBF'
            ]
        },

        // Sapphic
        {
            id: 'sapphic',
            label: 'Sapphic',
            words: ['sapphic'],
            colors: [
                '#FF8DC7',
                '#DDDDDD',
                '#D629A9',
                '#7B1FA2'
            ]
        },

        // Queerplatonic
        {
            id: 'queerplatonic',
            label: 'Queerplatonic',
            words: ['queerplatonic', 'queer-platonic', 'qpr'],
            colors: [
                '#F9E26C',
                '#F5A9B8',
                '#FFFFFF',
                '#B0B0B0',
                '#000000'
            ]
        },

        // Butch
        {
            id: 'butch',
            label: 'Butch',
            words: ['butch'],
            colors: [
                '#D87800',
                '#F0C000',
                '#FDF29C',
                '#FFFFFF',
                '#A7A3D0',
                '#736EB5',
                '#504C9A'
            ]
        },

        // Femme
        {
            id: 'femme',
            label: 'Femme',
            words: ['femme'],
            colors: [
                '#EF87C3',
                '#F5B0D7',
                '#F8D2E8',
                '#FFFFFF',
                '#C9A7E6',
                '#9B6BC7',
                '#7A3BA8'
            ]
        },

        // Bear (International Bear Brotherhood)
        {
            id: 'bear',
            label: 'Bear',
            words: ['bear', 'bears'],
            colors: [
                '#623804',
                '#D56300',
                '#FEDD63',
                '#FEE6B8',
                '#FFFFFF',
                '#555555',
                '#000000'
            ]
        },

        // Leather (Leather Pride)
        {
            id: 'leather',
            label: 'Leather',
            words: ['leather', 'leather pride'],
            colors: [
                '#000000',
                '#18186B',
                '#000000',
                '#18186B',
                '#000000',
                '#FFFFFF',
                '#E70039',
                '#FFFFFF',
                '#000000',
                '#18186B',
                '#000000'
            ]
        },

        // Straight ally / ally
        {
            id: 'straight-ally',
            label: 'Straight Ally',
            words: ['straight ally', 'ally', 'allies'],
            colors: [
                '#000000',
                '#FFFFFF',
                '#000000',
                '#FFFFFF',
                '#E40303',
                '#FF8C00',
                '#FFED00',
                '#008026',
                '#004DFF',
                '#750787',
                '#FFFFFF',
                '#000000',
                '#FFFFFF',
                '#000000'
            ]
        },

        // Questioning
        {
            id: 'questioning',
            label: 'Questioning',
            words: ['questioning'],
            colors: [
                '#FF75A2',
                '#DDDDDD',
                '#9C59D1',
                '#2C2C2C',
                '#5BCEFA'
            ]
        }
    ];

    /*
     * ============================================================
     * SETTINGS
     * ============================================================
     */

    const CASE_INSENSITIVE = true;
    const WHOLE_WORDS_ONLY = true;

    const IGNORED_ELEMENTS = new Set([
        'SCRIPT', 'STYLE', 'NOSCRIPT',
        'TEXTAREA', 'INPUT', 'SELECT', 'OPTION',
        'CODE', 'PRE', 'KBD', 'SAMP',
        'SVG', 'MATH'
    ]);

    const HIGHLIGHT_CLASS = '__pride_flag_highlight';
    const SCRIPT_VERSION = '1.3.0';
    const SETTINGS_KEY = 'prism.pride-highlighter.settings';
    const LEGACY_SETTINGS_KEY = 'pride.flag-highlighter.settings';
    const LAST_VERSION_KEY = 'prism.pride-highlighter.lastVersion';
    const UI_ROOT_ID = '__pride_flag_highlighter_ui';
    const UI_ROOT_SELECTOR = `#${UI_ROOT_ID}`;
    const HIGHLIGHT_SELECTOR = `.${HIGHLIGHT_CLASS}`;

    const OBSERVER_OPTIONS = {
        childList: true,
        subtree: true,
        characterData: true
    };

    const DEFAULT_SETTINGS = Object.freeze({
        enabled: true,
        style: 'gradient', // 'gradient' | 'underline'
        showLabels: true,
        disabledFlags: Object.freeze([]),
        excludedHosts: Object.freeze([])
    });

    function defaultSettings() {
        return {
            enabled: DEFAULT_SETTINGS.enabled,
            style: DEFAULT_SETTINGS.style,
            showLabels: DEFAULT_SETTINGS.showLabels,
            disabledFlags: [],
            excludedHosts: []
        };
    }

    function normalizeSettings(raw) {
        const source = raw && typeof raw === 'object' ? raw : {};
        const disabled = Array.isArray(source.disabledFlags)
            ? source.disabledFlags.filter(id => typeof id === 'string')
            : [];
        const excludedHosts = Array.isArray(source.excludedHosts)
            ? source.excludedHosts.filter(host => typeof host === 'string' && host.length > 0)
            : [];

        return {
            enabled: source.enabled !== false,
            style: source.style === 'underline' ? 'underline' : 'gradient',
            showLabels: source.showLabels !== false,
            disabledFlags: [...new Set(disabled)],
            excludedHosts: [...new Set(excludedHosts)]
        };
    }

    function currentHost() {
        return location.hostname;
    }

    function isSiteExcluded() {
        return settings.excludedHosts.includes(currentHost());
    }

    function loadSettings() {
        try {
            const current = localStorage.getItem(SETTINGS_KEY);
            const raw = current || localStorage.getItem(LEGACY_SETTINGS_KEY);
            if (!raw) {
                return defaultSettings();
            }
            const migrated = normalizeSettings(JSON.parse(raw));
            if (!current) {
                saveSettings(migrated);
            }
            return migrated;
        } catch (err) {
            return defaultSettings();
        }
    }

    function saveSettings(next) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    }

    let settings = loadSettings();

    /*
     * ============================================================
     * CSS / STYLE HELPERS
     * ============================================================
     */

    function flagGradient(colors, angle = '90deg') {
        return `linear-gradient(${angle}, ${colors.join(', ')})`;
    }

    const styleEl = document.createElement('style');

    function cssText() {
        // Hover tooltip visibility is gated by data-pfh-label="1" on spans;
        // opacity is always 1 when that attribute matches.
        return `
.${HIGHLIGHT_CLASS} {
  display: inline;
  position: relative;
  font: inherit !important;
  cursor: inherit;
}
.${HIGHLIGHT_CLASS}[data-pfh-style="gradient"] {
  background-image: var(--pfh-gradient) !important;
  background-clip: text !important;
  -webkit-background-clip: text !important;
  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
}
.${HIGHLIGHT_CLASS}[data-pfh-style="underline"] {
  color: inherit !important;
  -webkit-text-fill-color: currentColor !important;
  background-image: var(--pfh-gradient) !important;
  background-size: 100% 3px !important;
  background-repeat: no-repeat !important;
  background-position: 0 100% !important;
  padding-bottom: 2px !important;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
.${HIGHLIGHT_CLASS}[data-pfh-label="1"]::after {
  content: attr(data-pfh-name);
  position: absolute;
  left: 50%;
  top: calc(100% + 6px);
  transform: translateX(-50%) translateY(2px);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  z-index: 2147483646;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font: 600 11px/1.2 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  letter-spacing: 0.01em;
  color: #fff;
  background: #1a1a1a;
  box-shadow: 0 4px 14px rgba(0,0,0,0.28);
  transition: opacity 0.12s ease, transform 0.12s ease;
}
.${HIGHLIGHT_CLASS}[data-pfh-label="1"]:hover::after,
.${HIGHLIGHT_CLASS}[data-pfh-label="1"]:focus-visible::after {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
#${UI_ROOT_ID} {
  all: initial;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, sans-serif;
}
#${UI_ROOT_ID} * { box-sizing: border-box; }
#${UI_ROOT_ID} .pfh-fab {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 2147483647;
  width: 48px;
  height: 48px;
  padding: 0;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 13px;
  cursor: pointer;
  touch-action: none;
  background: #121722;
  box-shadow: 0 5px 18px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.35);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
#${UI_ROOT_ID} .pfh-fab img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}
#${UI_ROOT_ID} .pfh-fab:hover,
#${UI_ROOT_ID} .pfh-fab:focus-visible {
  transform: translateY(-1px);
  outline: none;
  box-shadow: 0 8px 22px rgba(0,0,0,0.38), 0 0 0 2px rgba(122,208,255,0.7);
}
#${UI_ROOT_ID} .pfh-fab[data-dragging="1"] { cursor: grabbing; transform: none; }
#${UI_ROOT_ID} .pfh-toast {
  position: fixed;
  left: 50%;
  bottom: 64px;
  transform: translateX(-50%) translateY(6px);
  z-index: 2147483647;
  max-width: min(360px, calc(100vw - 24px));
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: #12141a;
  color: #f2f4f8;
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  font: 600 12px/1.35 system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  letter-spacing: 0.01em;
  text-align: center;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.18s ease, transform 0.18s ease;
}
#${UI_ROOT_ID} .pfh-toast[data-show="1"] {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
#${UI_ROOT_ID} .pfh-host-note {
  font-size: 0.75rem;
  color: rgba(242,244,248,0.65);
  margin-top: -0.25rem;
}
#${UI_ROOT_ID} .pfh-panel {
  position: fixed;
  right: 16px;
  bottom: 68px;
  z-index: 2147483647;
  width: min(344px, calc(100vw - 24px));
  max-height: min(72vh, 540px);
  display: none;
  flex-direction: column;
  gap: 0;
  padding: 0;
  border-radius: 14px;
  background: #12141a;
  color: #f2f4f8;
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 16px 40px rgba(0,0,0,0.4);
}
#${UI_ROOT_ID} .pfh-panel[data-open="1"] { display: flex; }
#${UI_ROOT_ID} .pfh-panel h2 {
  margin: 0 0 0.2rem;
  font-size: 1rem;
  font-weight: 700;
}
#${UI_ROOT_ID} .pfh-panel-head,
#${UI_ROOT_ID} .pfh-section,
#${UI_ROOT_ID} .pfh-actions { padding-left: 18px; padding-right: 18px; }
#${UI_ROOT_ID} .pfh-panel-head { padding-top: 17px; padding-bottom: 13px; }
#${UI_ROOT_ID} .pfh-subtitle { margin: 0; color: rgba(242,244,248,0.66); font-size: 0.76rem; }
#${UI_ROOT_ID} .pfh-section { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px; padding-bottom: 10px; }
#${UI_ROOT_ID} .pfh-section-title { color: rgba(242,244,248,0.6); font-size: 0.7rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 6px; }
#${UI_ROOT_ID} .pfh-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 34px;
  font-size: 0.86rem;
}
#${UI_ROOT_ID} .pfh-row + .pfh-row { border-top: 1px solid rgba(255,255,255,0.06); }
#${UI_ROOT_ID} .pfh-row-main { min-height: 44px; font-weight: 700; }
#${UI_ROOT_ID} .pfh-row-main .pfh-row-copy { color: #fff; }
#${UI_ROOT_ID} .pfh-row-copy { min-width: 0; }
#${UI_ROOT_ID} .pfh-row-detail { display: block; color: rgba(242,244,248,0.57); font-size: .72rem; font-weight: 400; margin-top: 1px; }
#${UI_ROOT_ID} .pfh-switch { position: relative; display: inline-flex; flex: 0 0 auto; width: 36px; height: 20px; cursor: pointer; }
#${UI_ROOT_ID} .pfh-switch input { position: absolute; width: 1px; height: 1px; opacity: 0; }
#${UI_ROOT_ID} .pfh-switch-track { width: 36px; height: 20px; border-radius: 999px; background: #596171; border: 1px solid rgba(255,255,255,.2); transition: background .15s ease; }
#${UI_ROOT_ID} .pfh-switch-track::after { content: ''; display: block; width: 14px; height: 14px; margin: 2px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.4); transition: transform .15s ease; }
#${UI_ROOT_ID} .pfh-switch input:checked + .pfh-switch-track { background: linear-gradient(90deg, #e66aa1, #67cfff, #a185f5); }
#${UI_ROOT_ID} .pfh-switch input:checked + .pfh-switch-track::after { transform: translateX(16px); }
#${UI_ROOT_ID} .pfh-switch input:focus-visible + .pfh-switch-track { outline: 2px solid #9bdcff; outline-offset: 2px; }
#${UI_ROOT_ID} select,
#${UI_ROOT_ID} button.pfh-btn {
  font: inherit;
  font-size: 0.82rem;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.18);
  background: #1c2230;
  color: #f2f4f8;
  padding: 0.35rem 0.55rem;
}
#${UI_ROOT_ID} button.pfh-btn { cursor: pointer; }
#${UI_ROOT_ID} button.pfh-btn:hover,
#${UI_ROOT_ID} button.pfh-btn:focus-visible {
  background: #273044;
  outline: none;
}
#${UI_ROOT_ID} .pfh-flags {
  overflow: auto;
  max-height: 240px;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 0 0.55rem;
  display: flex;
  flex-direction: column;
  gap: 0.28rem;
  background: #0d0f14;
}
#${UI_ROOT_ID} .pfh-flags label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0.42rem 0;
}
#${UI_ROOT_ID} .pfh-flag-name { display: flex; align-items: center; gap: .45rem; min-width: 0; }
#${UI_ROOT_ID} .pfh-flag-name > span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#${UI_ROOT_ID} details.pfh-details > summary { cursor: pointer; list-style: none; display: flex; align-items: center; justify-content: space-between; min-height: 34px; font-size: .86rem; }
#${UI_ROOT_ID} details.pfh-details > summary::-webkit-details-marker { display: none; }
#${UI_ROOT_ID} details.pfh-details > summary::after { content: 'Show'; color: #9bdcff; font-size: .76rem; }
#${UI_ROOT_ID} details.pfh-details[open] > summary::after { content: 'Hide'; }
#${UI_ROOT_ID} .pfh-actions {
  display: flex;
  gap: 0.45rem;
  justify-content: space-between;
  padding-top: 10px;
  padding-bottom: 13px;
  border-top: 1px solid rgba(255,255,255,0.1);
}
#${UI_ROOT_ID} .pfh-swatch {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  flex: 0 0 auto;
  background-image: var(--pfh-swatch);
  border: 1px solid rgba(255,255,255,0.25);
}
`;
    }

    function installStyle() {
        styleEl.textContent = cssText();
        if (!styleEl.isConnected) {
            (document.head || document.documentElement).appendChild(styleEl);
        }
    }

    installStyle();

    /*
     * ============================================================
     * BUILD REGEX / MAP
     * ============================================================
     */

    function escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    let wordToFlag = new Map();
    let regex = null;

    function rebuildMatcher() {
        wordToFlag = new Map();
        const disabled = new Set(settings.disabledFlags);

        for (const flag of FLAGS) {
            if (disabled.has(flag.id)) {
                continue;
            }
            for (const word of flag.words) {
                wordToFlag.set(word.toLowerCase(), flag);
            }
        }

        const words = [...wordToFlag.keys()]
            .sort((a, b) => b.length - a.length)
            .map(escapeRegex);

        if (words.length === 0) {
            regex = null;
            return;
        }

        const boundaryStart = WHOLE_WORDS_ONLY ? '(?<![\\p{L}\\p{N}_-])' : '';
        const boundaryEnd = WHOLE_WORDS_ONLY ? '(?![\\p{L}\\p{N}_-])' : '';

        regex = new RegExp(
            `${boundaryStart}(${words.join('|')})${boundaryEnd}`,
            CASE_INSENSITIVE ? 'giu' : 'gu'
        );
    }

    rebuildMatcher();

    /*
     * ============================================================
     * CREATE HIGHLIGHT
     * ============================================================
     */

    function applyHighlightStyle(span, flag) {
        span.title = flag.label;
        span.setAttribute('aria-label', flag.label);
        span.dataset.pfhName = flag.label;
        span.dataset.pfhStyle = settings.style;
        span.dataset.pfhLabel = settings.showLabels ? '1' : '0';
        span.dataset.pfhId = flag.id;
        span.style.setProperty('--pfh-gradient', flagGradient(flag.colors));
    }

    function makeHighlight(text) {
        const flag = wordToFlag.get(text.toLowerCase());
        if (!flag) {
            return document.createTextNode(text);
        }

        const span = document.createElement('span');
        span.className = HIGHLIGHT_CLASS;
        span.textContent = text;
        applyHighlightStyle(span, flag);
        return span;
    }

    /*
     * ============================================================
     * PROCESS TEXT / DOM
     * ============================================================
     */

    function isUiNode(node) {
        if (!node || node.nodeType !== Node.ELEMENT_NODE) {
            return false;
        }
        return node.id === UI_ROOT_ID || Boolean(node.closest?.(UI_ROOT_SELECTOR));
    }

    function isIgnoredContext(el) {
        if (!el) {
            return true;
        }
        if (IGNORED_ELEMENTS.has(el.tagName) || el.isContentEditable) {
            return true;
        }
        return isUiNode(el);
    }

    function shouldSkipParent(parent) {
        return isIgnoredContext(parent) || Boolean(parent.closest(HIGHLIGHT_SELECTOR));
    }

    function highlightingActive() {
        return settings.enabled && !isSiteExcluded() && Boolean(regex);
    }

    function processTextNode(node) {
        if (!highlightingActive() || !node?.parentElement) {
            return;
        }

        const parent = node.parentElement;
        if (shouldSkipParent(parent)) {
            return;
        }

        const text = node.nodeValue;
        if (!text) {
            return;
        }

        regex.lastIndex = 0;
        if (!regex.test(text)) {
            regex.lastIndex = 0;
            return;
        }
        regex.lastIndex = 0;

        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            const start = match.index;
            const end = start + match[0].length;

            if (start > lastIndex) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
            }

            fragment.appendChild(makeHighlight(match[0]));
            lastIndex = end;
        }

        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        parent.replaceChild(fragment, node);
        regex.lastIndex = 0;
    }

    function acceptTextNode(node) {
        const parent = node.parentElement;
        if (!parent || shouldSkipParent(parent)) {
            return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
    }

    function processElement(element) {
        if (!highlightingActive()) {
            return;
        }
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            return;
        }
        if (isIgnoredContext(element) || element.classList.contains(HIGHLIGHT_CLASS)) {
            return;
        }

        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            { acceptNode: acceptTextNode }
        );

        const nodes = [];
        let node;
        while ((node = walker.nextNode())) {
            nodes.push(node);
        }

        for (const textNode of nodes) {
            processTextNode(textNode);
        }
    }

    function processPage() {
        if (document.body) {
            processElement(document.body);
        }
    }

    function clearHighlights(root) {
        const scope = root || document;
        if (!scope.querySelectorAll) {
            return;
        }

        for (const span of [...scope.querySelectorAll(HIGHLIGHT_SELECTOR)]) {
            const parent = span.parentNode;
            if (!parent) {
                continue;
            }
            parent.replaceChild(document.createTextNode(span.textContent || ''), span);
            parent.normalize();
        }
    }

    const observer = new MutationObserver(mutations => {
        if (!highlightingActive()) {
            return;
        }

        for (const mutation of mutations) {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    if (isUiNode(addedNode)) {
                        continue;
                    }
                    processElement(addedNode);
                } else if (addedNode.nodeType === Node.TEXT_NODE) {
                    processTextNode(addedNode);
                }
            }

            if (mutation.type === 'characterData') {
                processTextNode(mutation.target);
            }
        }
    });

    function startObserving() {
        if (!document.body) {
            return;
        }
        observer.observe(document.body, OBSERVER_OPTIONS);
    }

    function reprocessAll() {
        observer.disconnect();
        if (document.body) {
            clearHighlights(document.body);
        }
        rebuildMatcher();
        installStyle();
        if (settings.enabled && !isSiteExcluded()) {
            processPage();
        }
        startObserving();
    }

    /*
     * ============================================================
     * SETTINGS UI
     * ============================================================
     */

    let panelEl = null;
    let fabEl = null;
    let uiRoot = null;

    function applySettings(next, { persist = true } = {}) {
        settings = normalizeSettings(next);

        if (persist) {
            saveSettings(settings);
        }

        reprocessAll();
        syncPanelControls();
    }

    function syncPanelControls() {
        if (!panelEl) {
            return;
        }

        panelEl.querySelector('#pfh-enabled').checked = settings.enabled;
        panelEl.querySelector('#pfh-style').value = settings.style;
        panelEl.querySelector('#pfh-labels').checked = settings.showLabels;
        panelEl.querySelector('#pfh-exclude-site').checked = isSiteExcluded();

        const hostNote = panelEl.querySelector('#pfh-host-note');
        if (hostNote) {
            const host = currentHost() || '(unknown host)';
            hostNote.textContent = `Current site: ${host}`;
        }

        const disabled = new Set(settings.disabledFlags);
        for (const input of panelEl.querySelectorAll('.pfh-flag-toggle')) {
            input.checked = !disabled.has(input.value);
        }
    }

    function setPanelOpen(open) {
        if (!panelEl || !fabEl) {
            return;
        }
        panelEl.dataset.open = open ? '1' : '0';
        fabEl.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function readPanelSettings() {
        const disabledFlags = [];
        for (const input of panelEl.querySelectorAll('.pfh-flag-toggle')) {
            if (!input.checked) {
                disabledFlags.push(input.value);
            }
        }

        const host = currentHost();
        const excludedHosts = settings.excludedHosts.filter(h => h !== host);
        if (panelEl.querySelector('#pfh-exclude-site').checked && host) {
            excludedHosts.push(host);
        }

        return {
            enabled: panelEl.querySelector('#pfh-enabled').checked,
            style: panelEl.querySelector('#pfh-style').value,
            showLabels: panelEl.querySelector('#pfh-labels').checked,
            disabledFlags,
            excludedHosts
        };
    }

    function switchHtml(id, checked, label, className = '') {
        return `<label class="pfh-switch ${className}">` +
            `<input id="${id}" type="checkbox"${checked ? ' checked' : ''} aria-label="${label}" />` +
            '<span class="pfh-switch-track" aria-hidden="true"></span>' +
            '</label>';
    }

    function buildFlagChecklistHtml() {
        return FLAGS
            .slice()
            .sort((a, b) => a.label.localeCompare(b.label))
            .map(flag => {
                const swatch = flagGradient(flag.colors);
                return (
                    `<label>` +
                    '<span class="pfh-flag-name">' +
                    `<span class="pfh-swatch" style="--pfh-swatch:${swatch}"></span>` +
                    `<span>${flag.label}</span></span>` +
                    `<span class="pfh-switch"><input class="pfh-flag-toggle" type="checkbox" value="${flag.id}" checked aria-label="Enable ${flag.label}" />` +
                    '<span class="pfh-switch-track" aria-hidden="true"></span></span>' +
                    `</label>`
                );
            })
            .join('');
    }

    const FAB_SIZE = 48;
    const FAB_GAP = 8;
    const FAB_MARGIN = 16;
    const FAB_SEARCH_CAP = 400;
    const FAB_POSITION_KEY = 'prism.pride-highlighter.fabBottom';
    const FAB_ICON_URL = 'https://raw.githubusercontent.com/ExtraPotions/vivid-prism-heron/main/prism-pride-highlighter.svg';

    function savedFabBottom() {
        try {
            const value = Number(localStorage.getItem(FAB_POSITION_KEY));
            return Number.isFinite(value) && value >= FAB_MARGIN ? value : null;
        } catch (_err) {
            return null;
        }
    }

    function saveFabBottom(value) {
        try {
            localStorage.setItem(FAB_POSITION_KEY, String(value));
        } catch (_err) {
            // Position persistence is optional; dragging still works this page.
        }
    }

    function rectsOverlap(a, b) {
        return !(
            a.right <= b.left ||
            a.left >= b.right ||
            a.bottom <= b.top ||
            a.top >= b.bottom
        );
    }

    function fabTargetRect(rightPx, bottomPx) {
        const left = window.innerWidth - rightPx - FAB_SIZE;
        const top = window.innerHeight - bottomPx - FAB_SIZE;
        return {
            left,
            top,
            right: left + FAB_SIZE,
            bottom: top + FAB_SIZE,
            width: FAB_SIZE,
            height: FAB_SIZE
        };
    }

    function collectCornerObstacles() {
        const obstacles = [];
        const nodes = document.body ? document.body.querySelectorAll('*') : [];

        for (const el of nodes) {
            if (isUiNode(el)) {
                continue;
            }

            let style;
            try {
                style = window.getComputedStyle(el);
            } catch (_err) {
                continue;
            }

            const position = style.position;
            if (position !== 'fixed' && position !== 'sticky') {
                continue;
            }

            if (
                style.display === 'none' ||
                style.visibility === 'hidden' ||
                style.opacity === '0'
            ) {
                continue;
            }

            const rect = el.getBoundingClientRect();
            if (rect.width < 8 || rect.height < 8) {
                continue;
            }
            if (
                rect.bottom <= 0 ||
                rect.right <= 0 ||
                rect.top >= window.innerHeight ||
                rect.left >= window.innerWidth
            ) {
                continue;
            }

            obstacles.push({
                left: rect.left,
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom
            });
        }

        return obstacles;
    }

    function placeFabAndPanel() {
        if (!fabEl || !panelEl) {
            return;
        }

        const storedBottom = savedFabBottom();
        if (storedBottom !== null) {
            const bottom = Math.min(storedBottom, Math.max(FAB_MARGIN, window.innerHeight - FAB_SIZE - FAB_MARGIN));
            fabEl.style.right = `${FAB_MARGIN}px`;
            fabEl.style.bottom = `${bottom}px`;
            panelEl.style.right = `${FAB_MARGIN}px`;
            panelEl.style.bottom = `${bottom + FAB_SIZE + FAB_GAP}px`;
            return;
        }

        const step = FAB_SIZE + FAB_GAP;
        const obstacles = collectCornerObstacles();
        let chosenRight = FAB_MARGIN;
        let chosenBottom = FAB_MARGIN;
        let found = false;

        // Prefer left first (increase right), then up (increase bottom).
        // Prefer sitting to the left of other corner widgets; only stack upward if needed.
        for (let bottomOff = 0; bottomOff <= FAB_SEARCH_CAP && !found; bottomOff += step) {
            for (let rightOff = 0; rightOff <= FAB_SEARCH_CAP; rightOff += step) {
                const right = FAB_MARGIN + rightOff;
                const bottom = FAB_MARGIN + bottomOff;
                const target = fabTargetRect(right, bottom);

                if (target.left < FAB_MARGIN * 0.25 || target.top < FAB_MARGIN * 0.25) {
                    continue;
                }

                let blocked = false;
                for (const obs of obstacles) {
                    if (rectsOverlap(target, obs)) {
                        blocked = true;
                        break;
                    }
                }

                if (!blocked) {
                    chosenRight = right;
                    chosenBottom = bottom;
                    found = true;
                    break;
                }
            }
        }

        fabEl.style.right = `${chosenRight}px`;
        fabEl.style.bottom = `${chosenBottom}px`;
        panelEl.style.right = `${chosenRight}px`;
        panelEl.style.bottom = `${chosenBottom + FAB_SIZE + FAB_GAP}px`;
    }

    let fabPlaceTimer = null;
    let fabPlacementObserver = null;
    let fabPlacementSkip = false;

    function scheduleFabPlacement() {
        if (fabPlacementSkip) {
            return;
        }
        clearTimeout(fabPlaceTimer);
        fabPlaceTimer = setTimeout(() => {
            fabPlacementSkip = true;
            if (fabPlacementObserver) {
                fabPlacementObserver.disconnect();
            }
            try {
                placeFabAndPanel();
            } finally {
                requestAnimationFrame(() => {
                    if (fabPlacementObserver && document.body) {
                        fabPlacementObserver.observe(document.body, {
                            childList: true,
                            subtree: true
                        });
                    }
                    fabPlacementSkip = false;
                });
            }
        }, 120);
    }

    function mutationsAffectForeignUi(mutations) {
        for (const mutation of mutations) {
            if (mutation.type !== 'childList') {
                continue;
            }

            const target = mutation.target;
            if (target && target.nodeType === Node.ELEMENT_NODE && isUiNode(target)) {
                continue;
            }

            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) {
                    continue;
                }
                if (node.id === UI_ROOT_ID || isUiNode(node)) {
                    continue;
                }
                return true;
            }

            for (const node of mutation.removedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) {
                    continue;
                }
                if (node.id === UI_ROOT_ID || isUiNode(node)) {
                    continue;
                }
                return true;
            }
        }
        return false;
    }

    function installFabPlacementWatchers() {
        window.addEventListener('resize', scheduleFabPlacement);

        if (!document.body || fabPlacementObserver) {
            return;
        }

        fabPlacementObserver = new MutationObserver((mutations) => {
            if (fabPlacementSkip) {
                return;
            }
            if (mutationsAffectForeignUi(mutations)) {
                scheduleFabPlacement();
            }
        });
        fabPlacementObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }


    function buildUI() {
        if (document.getElementById(UI_ROOT_ID)) {
            return;
        }

        uiRoot = document.createElement('div');
        uiRoot.id = UI_ROOT_ID;

        fabEl = document.createElement('button');
        fabEl.type = 'button';
        fabEl.className = 'pfh-fab';
        fabEl.title = 'Prism Pride Highlighter settings';
        fabEl.setAttribute('aria-label', 'Prism Pride Highlighter settings');
        fabEl.setAttribute('aria-expanded', 'false');
        fabEl.setAttribute('aria-controls', 'pfh-panel');

        const fabImg = document.createElement('img');
        fabImg.src = FAB_ICON_URL;
        fabImg.alt = '';
        fabImg.draggable = false;
        fabEl.appendChild(fabImg);

        panelEl = document.createElement('div');
        panelEl.className = 'pfh-panel';
        panelEl.id = 'pfh-panel';
        panelEl.dataset.open = '0';
        panelEl.setAttribute('role', 'dialog');
        panelEl.setAttribute('aria-label', 'Prism Pride Highlighter settings');

        panelEl.innerHTML = `
            <div class="pfh-panel-head"><h2>Prism Pride Highlighter</h2><p class="pfh-subtitle">Reveal identity colour cues in page text.</p></div>
            <div class="pfh-section">
                <div class="pfh-section-title">Protection</div>
                <div class="pfh-row pfh-row-main"><span class="pfh-row-copy">Highlight protection<span class="pfh-row-detail">Enable colour highlighting</span></span>${switchHtml('pfh-enabled', true, 'Enable highlight protection')}</div>
            </div>
            <div class="pfh-section">
                <div class="pfh-section-title">This site</div>
                <div class="pfh-row"><span class="pfh-row-copy">Exclude this site<span class="pfh-row-detail" id="pfh-host-note"></span></span>${switchHtml('pfh-exclude-site', false, 'Exclude this site')}</div>
            </div>
            <div class="pfh-section">
                <div class="pfh-section-title">Appearance</div>
                <div class="pfh-row"><span>Highlight style</span><select id="pfh-style" aria-label="Highlight style"><option value="gradient">Gradient text</option><option value="underline">Underline</option></select></div>
                <div class="pfh-row"><span>Hover labels</span>${switchHtml('pfh-labels', true, 'Show hover labels')}</div>
            </div>
            <div class="pfh-section">
                <details class="pfh-details"><summary>Flag visibility</summary><div class="pfh-flags">${buildFlagChecklistHtml()}</div></details>
            </div>
            <div class="pfh-actions">
                <button type="button" class="pfh-btn" id="pfh-reset">Reset defaults</button>
                <button type="button" class="pfh-btn" id="pfh-close">Close</button>
            </div>
        `;

        uiRoot.appendChild(panelEl);
        uiRoot.appendChild(fabEl);
        (document.body || document.documentElement).appendChild(uiRoot);

        let fabWasDragged = false;
        fabEl.addEventListener('pointerdown', (ev) => {
            if (ev.button !== 0) {
                return;
            }
            const startY = ev.clientY;
            const startBottom = Number.parseFloat(fabEl.style.bottom) || FAB_MARGIN;
            let moved = false;
            fabEl.setPointerCapture(ev.pointerId);
            const onMove = (moveEv) => {
                const distance = moveEv.clientY - startY;
                if (Math.abs(distance) > 4) {
                    moved = true;
                    fabEl.dataset.dragging = '1';
                    const maxBottom = Math.max(FAB_MARGIN, window.innerHeight - FAB_SIZE - FAB_MARGIN);
                    const bottom = Math.max(FAB_MARGIN, Math.min(maxBottom, startBottom - distance));
                    fabEl.style.bottom = `${bottom}px`;
                    panelEl.style.bottom = `${bottom + FAB_SIZE + FAB_GAP}px`;
                }
            };
            const onEnd = () => {
                fabEl.removeEventListener('pointermove', onMove);
                fabEl.removeEventListener('pointerup', onEnd);
                fabEl.removeEventListener('pointercancel', onEnd);
                delete fabEl.dataset.dragging;
                if (moved) {
                    fabWasDragged = true;
                    saveFabBottom(Number.parseFloat(fabEl.style.bottom));
                }
            };
            fabEl.addEventListener('pointermove', onMove);
            fabEl.addEventListener('pointerup', onEnd);
            fabEl.addEventListener('pointercancel', onEnd);
        });

        fabEl.addEventListener('click', (ev) => {
            ev.stopPropagation();
            if (fabWasDragged) {
                fabWasDragged = false;
                return;
            }
            setPanelOpen(panelEl.dataset.open !== '1');
        });

        panelEl.addEventListener('click', (ev) => ev.stopPropagation());

        panelEl.querySelector('#pfh-close').addEventListener('click', () => setPanelOpen(false));
        panelEl.querySelector('#pfh-reset').addEventListener('click', () => {
            applySettings(defaultSettings());
            try {
                localStorage.removeItem(FAB_POSITION_KEY);
            } catch (_err) {
                // Resetting the display position is optional.
            }
            placeFabAndPanel();
        });

        const onChange = () => applySettings(readPanelSettings());
        panelEl.querySelector('#pfh-enabled').addEventListener('change', onChange);
        panelEl.querySelector('#pfh-exclude-site').addEventListener('change', onChange);
        panelEl.querySelector('#pfh-style').addEventListener('change', onChange);
        panelEl.querySelector('#pfh-labels').addEventListener('change', onChange);
        panelEl.querySelector('.pfh-flags').addEventListener('change', onChange);

        document.addEventListener('keydown', (ev) => {
            if (ev.key === 'Escape' && panelEl.dataset.open === '1') {
                setPanelOpen(false);
            }
        });

        document.addEventListener('click', (ev) => {
            if (panelEl.dataset.open !== '1') {
                return;
            }
            if (uiRoot.contains(ev.target)) {
                return;
            }
            setPanelOpen(false);
        });

        syncPanelControls();
        installFabPlacementWatchers();
        requestAnimationFrame(() => {
            placeFabAndPanel();
        });
    }

    /*
     * ============================================================
     * VERSION TOAST
     * ============================================================
     */

    let toastEl = null;
    let toastTimer = null;

    function ensureToastEl() {
        if (toastEl && toastEl.isConnected) {
            return toastEl;
        }
        if (!uiRoot) {
            return null;
        }
        toastEl = document.createElement('div');
        toastEl.className = 'pfh-toast';
        toastEl.setAttribute('role', 'status');
        toastEl.setAttribute('aria-live', 'polite');
        uiRoot.appendChild(toastEl);
        return toastEl;
    }

    function showToast(message, durationMs = 3500) {
        const el = ensureToastEl();
        if (!el) {
            return;
        }
        el.textContent = message;
        el.dataset.show = '1';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            el.dataset.show = '0';
        }, durationMs);
    }

    function maybeShowVersionToast() {
        // Only announce real upgrades, once per version. No toast on first
        // install or on every page load.
        let previous = null;
        try {
            previous = localStorage.getItem(LAST_VERSION_KEY);
        } catch (_err) {
            return;
        }

        if (previous === SCRIPT_VERSION) {
            return;
        }

        // Persist first so a failed toast never re-fires every navigation.
        try {
            localStorage.setItem(LAST_VERSION_KEY, SCRIPT_VERSION);
        } catch (_err) {
            return;
        }

        // First run: record version quietly.
        if (!previous) {
            return;
        }

        const shownKey = `${LAST_VERSION_KEY}:shown:${SCRIPT_VERSION}`;
        try {
            if (sessionStorage.getItem(shownKey)) {
                return;
            }
            sessionStorage.setItem(shownKey, '1');
        } catch (_err) {
            // sessionStorage optional; still show once after persist above
        }

        showToast(`Prism Pride Highlighter updated to v${SCRIPT_VERSION}`);
    }

    /*
     * ============================================================
     * START
     * ============================================================
     */

    function start() {
        buildUI();
        reprocessAll();
        maybeShowVersionToast();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }

})();
