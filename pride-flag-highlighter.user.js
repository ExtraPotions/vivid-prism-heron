// ==UserScript==
// @name         Prism Pride Highlighter
// @namespace    prism.pride-highlighter
// @version      2.0.0
// @description  Reveals queer- and LGBTQ+-related words with their associated pride flag colours.
// @author       expDARE
// @license      CC BY-NC-SA 4.0
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @noframes
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

    /*
     * Runtime v2 is deliberately self-contained.  The flag catalogue above is
     * retained verbatim; everything below this call is the retired v1 runtime.
     */
    polishedRuntime(FLAGS);
    return;

    function polishedRuntime(flags) {
        const VERSION = '2.0.0';
        const SETTINGS_KEY = 'prism.pride-highlighter.settings';
        const LEGACY_KEY = 'pride.flag-highlighter.settings';
        const POSITION_KEY = 'prism.pride-highlighter.dock-position';
        const ROOT_ID = '__prism_pride_highlighter_v2';
        const HIT = 'pph-hit';
        const defaults = Object.freeze({
            enabled: true, style: 'gradient', intensity: 'balanced', labels: true,
            visibleOnly: false, reducedMotion: false, highContrast: false,
            disabledFlags: [], excludedHosts: []
        });
        const ignoredTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'BUTTON', 'CODE', 'PRE', 'KBD', 'SAMP', 'SVG', 'MATH']);
        let settings = loadSettings();
        let matcher = null;
        let wordMap = new Map();
        let uiRoot, fab, panel, styleNode;
        let scanTimer = 0;
        let domSafeForHighlight = false;
        let pendingMutations = [];
        let mutationTimer = 0;
        const roots = new Set();
        const observer = new MutationObserver(onMutations);

        function loadSettings() {
            try {
                const raw = localStorage.getItem(SETTINGS_KEY) || localStorage.getItem(LEGACY_KEY);
                return normalise(raw ? JSON.parse(raw) : defaults);
            } catch (_err) { return { ...defaults, disabledFlags: [], excludedHosts: [] }; }
        }
        function normalise(value) {
            const source = value && typeof value === 'object' ? value : {};
            return {
                enabled: source.enabled !== false,
                style: ['gradient', 'underline', 'background'].includes(source.style) ? source.style : defaults.style,
                intensity: ['subtle', 'balanced', 'vivid'].includes(source.intensity) ? source.intensity : defaults.intensity,
                labels: source.labels !== false && source.showLabels !== false,
                visibleOnly: source.visibleOnly === true,
                reducedMotion: source.reducedMotion === true,
                highContrast: source.highContrast === true,
                disabledFlags: Array.isArray(source.disabledFlags) ? [...new Set(source.disabledFlags.filter(v => typeof v === 'string'))] : [],
                excludedHosts: Array.isArray(source.excludedHosts) ? [...new Set(source.excludedHosts.filter(v => typeof v === 'string'))] : []
            };
        }
        function save() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch (_err) {} }
        function host() { return location.hostname; }
        function excluded() { return settings.excludedHosts.includes(host()); }
        function active() { return domSafeForHighlight && settings.enabled && !excluded() && Boolean(matcher); }
        function escapeRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

        function rebuildMatcher() {
            wordMap = new Map();
            const disabled = new Set(settings.disabledFlags);
            for (const flag of flags) {
                if (disabled.has(flag.id)) continue;
                for (const word of flag.words) wordMap.set(word.toLowerCase(), flag);
            }
            const words = [...wordMap.keys()].sort((a, b) => b.length - a.length).map(escapeRegex);
            matcher = words.length ? new RegExp(`\\b(${words.join('|')})\\b`, 'gi') : null;
        }

        function css() {
            return `
.${HIT}{--pph-colours:#ff6da8,#ffdc62,#68d8ff,#a98cff;color:inherit;position:relative;text-decoration:none;font:inherit;cursor:default}
.${HIT}[data-style="gradient"]{background:linear-gradient(90deg,var(--pph-colours));background-clip:text;-webkit-background-clip:text;color:transparent;-webkit-text-fill-color:transparent}
.${HIT}[data-style="underline"]{text-decoration:underline 3px;color:inherit;text-decoration-color:var(--pph-first,#7edbff);text-underline-offset:3px}
.${HIT}[data-style="background"]{background:linear-gradient(90deg,var(--pph-colours));background-size:100% 100%;box-decoration-break:clone;-webkit-box-decoration-break:clone;padding:0 .08em;border-radius:.16em;color:#10131a}
.${HIT}[data-intensity="subtle"]{filter:saturate(.68);opacity:.86}.${HIT}[data-intensity="vivid"]{filter:saturate(1.2) contrast(1.05)}
.${HIT}[data-label="1"]{cursor:copy}.${HIT}[data-label="1"]:hover::after,.${HIT}[data-label="1"]:focus-visible::after{content:attr(data-name);position:absolute;z-index:2147483647;left:0;bottom:calc(100% + 6px);padding:4px 7px;border-radius:6px;background:#121722;color:#fff;font:600 12px/1.2 system-ui,sans-serif;white-space:nowrap;box-shadow:0 4px 16px #0008}.${HIT}[data-align="right"]:hover::after,.${HIT}[data-align="right"]:focus-visible::after{left:auto;right:0}.${HIT}[data-position="below"]:hover::after,.${HIT}[data-position="below"]:focus-visible::after{bottom:auto;top:calc(100% + 6px)}
#${ROOT_ID}{all:initial}#${ROOT_ID},#${ROOT_ID} *{box-sizing:border-box}#${ROOT_ID} button,#${ROOT_ID} select,#${ROOT_ID} input{font-family:system-ui,-apple-system,Segoe UI,sans-serif}
#${ROOT_ID} .pph-fab{position:fixed;z-index:2147483647;width:48px;height:48px;padding:0;border:1px solid #ffffff35;border-radius:13px;background:#121722;box-shadow:0 5px 18px #0007;cursor:grab;touch-action:none}#${ROOT_ID} .pph-fab:focus-visible{outline:2px solid #9bdcff;outline-offset:2px}#${ROOT_ID} .pph-fab img{display:block;width:100%;height:100%;pointer-events:none}
#${ROOT_ID} .pph-panel{position:fixed;z-index:2147483646;width:min(312px,calc(100vw - 24px));max-height:min(68vh,500px);display:none;overflow:auto;border:1px solid #ffffff22;border-radius:14px;background:#12141a;color:#f2f4f8;box-shadow:0 16px 40px #0009}#${ROOT_ID} .pph-panel[data-open="1"]{display:block}#${ROOT_ID}[data-contrast="1"] .pph-panel{border:2px solid #fff}#${ROOT_ID}[data-motion="1"] *{transition:none!important;animation:none!important}
#${ROOT_ID} .pph-head,#${ROOT_ID} .pph-section,#${ROOT_ID} .pph-actions{padding-left:18px;padding-right:18px}#${ROOT_ID} .pph-head{padding-top:14px;padding-bottom:10px}#${ROOT_ID} h2{margin:0 0 2px;font:700 16px/1.2 system-ui,sans-serif}#${ROOT_ID} .pph-sub{margin:0;color:#c3cad6;font:12px/1.3 system-ui,sans-serif}
#${ROOT_ID} .pph-quick{display:flex;gap:4px;margin-top:9px}#${ROOT_ID} .pph-quick button{flex:1;min-height:28px;border:1px solid #ffffff28;border-radius:7px;background:#1c2230;color:#e8edf7;font-size:11px;cursor:pointer}#${ROOT_ID} .pph-quick button[aria-pressed="true"]{border-color:transparent;background:linear-gradient(90deg,#ff90bd,#ffe071,#77dfff);color:#10131a}
#${ROOT_ID} .pph-section{border-top:1px solid #ffffff18;padding-top:8px;padding-bottom:8px}#${ROOT_ID} .pph-title{margin-bottom:4px;color:#aeb7c7;font:700 10px/1 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase}#${ROOT_ID} .pph-row{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:32px;font:13px/1.2 system-ui,sans-serif}#${ROOT_ID} .pph-copy{min-width:0}#${ROOT_ID} .pph-detail{display:block;color:#abb4c3;font-size:11px;margin-top:2px}#${ROOT_ID} .pph-status{color:#8fe3a6}.pph-status[data-excluded="1"]{color:#ffb0b0}
#${ROOT_ID} .pph-switch{display:inline-flex;width:36px;height:20px;flex:none;cursor:pointer}#${ROOT_ID} .pph-switch input{position:absolute;opacity:0;width:1px;height:1px}#${ROOT_ID} .pph-track{width:36px;height:20px;border:1px solid #ffffff35;border-radius:99px;background:#596171}#${ROOT_ID} .pph-track::after{content:"";display:block;width:14px;height:14px;margin:2px;border-radius:50%;background:#fff;box-shadow:0 1px 3px #0008;transition:transform .15s}#${ROOT_ID} .pph-switch input:checked+.pph-track{background:linear-gradient(90deg,#e66aa1,#67cfff,#a185f5)}#${ROOT_ID} .pph-switch input:checked+.pph-track::after{transform:translateX(16px)}#${ROOT_ID} .pph-switch input:focus-visible+.pph-track{outline:2px solid #9bdcff;outline-offset:2px}
#${ROOT_ID} select,#${ROOT_ID} .pph-actions button{border:1px solid #ffffff30;border-radius:8px;background:#1c2230;color:#f2f4f8;padding:6px 8px;font-size:12px}#${ROOT_ID} details summary{display:flex;align-items:center;justify-content:space-between;min-height:32px;cursor:pointer;font:13px system-ui,sans-serif}#${ROOT_ID} details summary::after{content:"Show";color:#9bdcff;font-size:11px}#${ROOT_ID} details[open] summary::after{content:"Hide"}#${ROOT_ID} .pph-search{width:100%;margin:4px 0 7px;padding:7px 8px;border:1px solid #ffffff30;border-radius:7px;background:#171c27;color:#fff}#${ROOT_ID} .pph-flags{max-height:220px;overflow:auto;border:1px solid #ffffff1c;border-radius:9px;padding:0 8px}#${ROOT_ID} .pph-flag{display:flex;align-items:center;justify-content:space-between;min-height:30px;border-bottom:1px solid #ffffff12;font:12px system-ui,sans-serif}#${ROOT_ID} .pph-flag:last-child{border:0}#${ROOT_ID} .pph-swatch{width:13px;height:13px;border-radius:3px;background:var(--swatch);margin-right:7px;display:inline-block;vertical-align:-2px}#${ROOT_ID} .pph-actions{position:sticky;bottom:0;display:flex;justify-content:space-between;padding-top:9px;padding-bottom:10px;border-top:1px solid #ffffff1c;background:#12141a}
@media (prefers-reduced-motion:reduce){#${ROOT_ID} *{transition:none!important;animation:none!important}}
`;
        }

        function installStyle() {
            if (!styleNode) { styleNode = document.createElement('style'); document.documentElement.appendChild(styleNode); }
            styleNode.textContent = css();
        }
        function ignored(parent) {
            return !parent || ignoredTags.has(parent.tagName) || parent.isContentEditable || Boolean(parent.closest(`#${ROOT_ID}, .${HIT}, form, [contenteditable="true"]`));
        }
        function inView(el) {
            const rect = el.getBoundingClientRect();
            return rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
        }
        function decorate(word) {
            const flag = wordMap.get(word.toLowerCase());
            if (!flag) return document.createTextNode(word);
            const span = document.createElement('span');
            span.className = HIT; span.textContent = word; span.tabIndex = settings.labels ? 0 : -1;
            span.dataset.name = flag.label; span.dataset.style = settings.style; span.dataset.intensity = settings.intensity; span.dataset.label = settings.labels ? '1' : '0';
            span.style.setProperty('--pph-colours', flag.colors.join(',')); span.style.setProperty('--pph-first', flag.colors[0]);
            span.addEventListener('pointerenter', () => placeLabel(span));
            span.addEventListener('click', () => copyLabel(flag.label));
            span.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); copyLabel(flag.label); } });
            return span;
        }
        function placeLabel(span) { const r = span.getBoundingClientRect(); span.dataset.position = r.top < 34 ? 'below' : 'above'; span.dataset.align = r.left > innerWidth - 160 ? 'right' : 'left'; }
        function copyLabel(label) { if (settings.labels && navigator.clipboard?.writeText) navigator.clipboard.writeText(label).catch(() => {}); }
        function processText(node) {
            if (!active() || !node?.parentElement || ignored(node.parentElement) || (settings.visibleOnly && !inView(node.parentElement))) return;
            const text = node.nodeValue || ''; matcher.lastIndex = 0; if (!matcher.test(text)) return; matcher.lastIndex = 0;
            const fragment = document.createDocumentFragment(); let last = 0, match;
            while ((match = matcher.exec(text))) { if (match.index > last) fragment.append(document.createTextNode(text.slice(last, match.index))); fragment.append(decorate(match[0])); last = match.index + match[0].length; }
            if (last < text.length) fragment.append(document.createTextNode(text.slice(last)));
            try { if (node.parentNode === node.parentElement) node.replaceWith(fragment); } catch (_err) {} matcher.lastIndex = 0;
        }
        function scan(root) {
            if (!active() || !root) return;
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode(node) { const p = node.parentElement; return ignored(p) || (settings.visibleOnly && !inView(p)) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT; } });
            const nodes = []; let node; while ((node = walker.nextNode())) nodes.push(node); for (const text of nodes) processText(text);
            discoverShadowRoots(root);
        }
        function clear(root) { if (!root?.querySelectorAll) return; for (const span of root.querySelectorAll(`.${HIT}`)) { span.replaceWith(document.createTextNode(span.textContent || '')); span.parentNode?.normalize(); } }
        function discoverShadowRoots(root) { if (!root?.querySelectorAll) return; if (root.shadowRoot) observeRoot(root.shadowRoot); for (const el of root.querySelectorAll('*')) if (el.shadowRoot) observeRoot(el.shadowRoot); }
        function observeRoot(root) { if (!root) return; roots.add(root); observer.observe(root, { childList:true, subtree:true, characterData:true }); scan(root); }
        function flushMutations() { mutationTimer = 0; if (!active()) { pendingMutations = []; return; } const batch = pendingMutations; pendingMutations = []; for (const mutation of batch) { if (mutation.type === 'characterData') processText(mutation.target); for (const node of mutation.addedNodes) { if (node.nodeType === Node.TEXT_NODE) processText(node); if (node.nodeType === Node.ELEMENT_NODE && node.id !== ROOT_ID) scan(node); } } }
        function onMutations(mutations) { if (!active()) return; pendingMutations.push(...mutations); if (!mutationTimer) mutationTimer = window.setTimeout(flushMutations, 48); }
        function refresh() { observer.disconnect(); pendingMutations = []; if (mutationTimer) { clearTimeout(mutationTimer); mutationTimer = 0; } clear(document.body); for (const root of roots) clear(root); rebuildMatcher(); installStyle(); if (!domSafeForHighlight) { syncUi(); return; } if (active()) scan(document.body); observer.observe(document.body, { childList:true, subtree:true, characterData:true }); for (const root of roots) observer.observe(root, { childList:true, subtree:true, characterData:true }); syncUi(); }
        function scheduleVisibleScan() { if (!settings.visibleOnly || scanTimer) return; scanTimer = requestAnimationFrame(() => { scanTimer = 0; scan(document.body); }); }

        function switchMarkup(id, checked, label) { return `<label class="pph-switch"><input id="${id}" type="checkbox" ${checked ? 'checked' : ''} aria-label="${label}"><span class="pph-track" aria-hidden="true"></span></label>`; }
        function flagMarkup() { return flags.map(flag => `<label class="pph-flag"><span><i class="pph-swatch" style="--swatch:linear-gradient(180deg,${flag.colors.join(',')})"></i>${flag.label}</span>${switchMarkup(`pph-flag-${flag.id}`, !settings.disabledFlags.includes(flag.id), `Show ${flag.label}`)}</label>`).join(''); }
        function buildUi() {
            uiRoot = document.createElement('div'); uiRoot.id = ROOT_ID;
            fab = document.createElement('button'); fab.className = 'pph-fab'; fab.type = 'button'; fab.setAttribute('aria-label', 'Prism Pride Highlighter settings'); fab.setAttribute('aria-expanded', 'false'); fab.innerHTML = '<img alt="" src="https://raw.githubusercontent.com/ExtraPotions/vivid-prism-heron/main/prism-pride-highlighter.svg">';
            panel = document.createElement('aside'); panel.className = 'pph-panel'; panel.setAttribute('aria-label', 'Prism Pride Highlighter settings');
            panel.innerHTML = `<div class="pph-head"><h2>Prism Pride Highlighter</h2><p class="pph-sub">Reveal identity colour cues in page text.</p><div class="pph-quick" aria-label="Quick style buttons"><button data-style="gradient">Gradient</button><button data-style="underline">Underline</button><button data-style="background">Soft fill</button></div></div><section class="pph-section"><div class="pph-title">Protection</div><div class="pph-row"><span class="pph-copy"><b>Highlight protection</b><span class="pph-detail">Enable colour highlighting</span></span>${switchMarkup('pph-enabled', settings.enabled, 'Enable highlighting')}</div></section><section class="pph-section"><div class="pph-title">This site</div><div class="pph-row"><span class="pph-copy">Exclude this site<span id="pph-host" class="pph-detail"></span><span id="pph-status" class="pph-detail pph-status" role="status"></span></span>${switchMarkup('pph-exclude', excluded(), 'Exclude this site')}</div></section><section class="pph-section"><div class="pph-title">Appearance</div><div class="pph-row"><span>Highlight style</span><select id="pph-style"><option value="gradient">Gradient text</option><option value="underline">Underline</option><option value="background">Soft background</option></select></div><div class="pph-row"><span>Intensity</span><select id="pph-intensity"><option value="subtle">Subtle</option><option value="balanced">Balanced</option><option value="vivid">Vivid</option></select></div><div class="pph-row"><span>Hover labels</span>${switchMarkup('pph-labels', settings.labels, 'Show hover labels')}</div></section><section class="pph-section"><details><summary>Performance & accessibility</summary><div class="pph-row"><span>Only process visible content</span>${switchMarkup('pph-visible', settings.visibleOnly, 'Only process visible content')}</div><div class="pph-row"><span>Reduce motion</span>${switchMarkup('pph-motion', settings.reducedMotion, 'Reduce motion')}</div><div class="pph-row"><span>High contrast</span>${switchMarkup('pph-contrast', settings.highContrast, 'High contrast')}</div></details></section><section class="pph-section"><details><summary>Flag visibility</summary><input id="pph-search" class="pph-search" type="search" placeholder="Search ${flags.length} flags" aria-label="Search flags"><div class="pph-flags">${flagMarkup()}</div></details></section><footer class="pph-actions"><button id="pph-reset" type="button">Reset defaults</button><button id="pph-close" type="button">Close</button></footer>`;
            uiRoot.append(panel, fab); (document.body || document.documentElement).append(uiRoot); placeDock(); bindUi(); syncUi();
        }
        function readUi() {
            const disabled = flags.filter(flag => !panel.querySelector(`#pph-flag-${CSS.escape(flag.id)}`)?.checked).map(flag => flag.id);
            const hosts = settings.excludedHosts.filter(value => value !== host()); if (panel.querySelector('#pph-exclude').checked && host()) hosts.push(host());
            return normalise({ enabled: panel.querySelector('#pph-enabled').checked, style: panel.querySelector('#pph-style').value, intensity: panel.querySelector('#pph-intensity').value, labels: panel.querySelector('#pph-labels').checked, visibleOnly: panel.querySelector('#pph-visible').checked, reducedMotion: panel.querySelector('#pph-motion').checked, highContrast: panel.querySelector('#pph-contrast').checked, disabledFlags: disabled, excludedHosts: hosts });
        }
        function apply(next) { settings = next; save(); refresh(); }
        function syncUi() {
            if (!panel) return; uiRoot.dataset.contrast = settings.highContrast ? '1' : '0'; uiRoot.dataset.motion = settings.reducedMotion ? '1' : '0';
            panel.querySelector('#pph-enabled').checked = settings.enabled; panel.querySelector('#pph-exclude').checked = excluded(); panel.querySelector('#pph-style').value = settings.style; panel.querySelector('#pph-intensity').value = settings.intensity; panel.querySelector('#pph-labels').checked = settings.labels; panel.querySelector('#pph-visible').checked = settings.visibleOnly; panel.querySelector('#pph-motion').checked = settings.reducedMotion; panel.querySelector('#pph-contrast').checked = settings.highContrast;
            panel.querySelectorAll('.pph-quick button').forEach(button => button.setAttribute('aria-pressed', button.dataset.style === settings.style ? 'true' : 'false'));
            panel.querySelector('#pph-host').textContent = `Current site: ${host() || '(unknown)'}`; const status = panel.querySelector('#pph-status'); status.textContent = excluded() ? 'Highlighting paused on this site' : 'Highlighting active on this site'; status.dataset.excluded = excluded() ? '1' : '0';
        }
        function bindUi() {
            fab.addEventListener('click', event => { if (fab.dataset.dragged === '1') { delete fab.dataset.dragged; return; } togglePanel(panel.dataset.open !== '1'); });
            panel.addEventListener('change', () => apply(readUi()));
            panel.querySelector('.pph-quick').addEventListener('click', event => { const button = event.target.closest('button[data-style]'); if (!button) return; panel.querySelector('#pph-style').value = button.dataset.style; apply(readUi()); });
            panel.querySelector('#pph-search').addEventListener('input', event => { const query = event.target.value.trim().toLowerCase(); panel.querySelectorAll('.pph-flag').forEach(row => row.hidden = Boolean(query) && !row.textContent.toLowerCase().includes(query)); });
            panel.querySelector('#pph-close').addEventListener('click', () => togglePanel(false));
            panel.querySelector('#pph-reset').addEventListener('click', () => { settings = { ...defaults, disabledFlags: [], excludedHosts: [] }; try { localStorage.removeItem(POSITION_KEY); } catch (_err) {} save(); placeDock(true); refresh(); });
            let startY = 0, startBottom = 0, moved = false;
            fab.addEventListener('pointerdown', event => { if (event.button !== 0) return; startY = event.clientY; startBottom = parseFloat(fab.style.bottom) || 16; moved = false; fab.setPointerCapture(event.pointerId); });
            fab.addEventListener('pointermove', event => { if (!fab.hasPointerCapture(event.pointerId)) return; const delta = event.clientY - startY; if (Math.abs(delta) < 4) return; moved = true; const bottom = Math.max(16, Math.min(innerHeight - 64, startBottom - delta)); setDock(parseFloat(fab.style.right) || 16, bottom); });
            fab.addEventListener('pointerup', event => { if (!fab.hasPointerCapture(event.pointerId)) return; fab.releasePointerCapture(event.pointerId); if (moved) { fab.dataset.dragged = '1'; saveDock(); } });
            document.addEventListener('keydown', event => { if (event.key === 'Escape') togglePanel(false); }); window.addEventListener('scroll', scheduleVisibleScan, { passive:true }); window.addEventListener('resize', () => { if (settings.visibleOnly) scheduleVisibleScan(); });
        }
        function togglePanel(open) { panel.dataset.open = open ? '1' : '0'; fab.setAttribute('aria-expanded', open ? 'true' : 'false'); }
        function savedDock() { try { const value = JSON.parse(localStorage.getItem(POSITION_KEY)); return Number.isFinite(value?.right) && Number.isFinite(value?.bottom) ? value : null; } catch (_err) { return null; } }
        function saveDock() { try { localStorage.setItem(POSITION_KEY, JSON.stringify({ right: parseFloat(fab.style.right), bottom: parseFloat(fab.style.bottom) })); } catch (_err) {} }
        function setDock(right, bottom) { fab.style.right = `${right}px`; fab.style.bottom = `${bottom}px`; panel.style.right = `${right}px`; panel.style.bottom = `${bottom + 56}px`; }
        function placeDock(force = false) { const saved = !force && savedDock(); if (saved) return setDock(Math.max(16, saved.right), Math.max(16, Math.min(saved.bottom, innerHeight - 64))); let right = 16, bottom = 16; const controls = [...document.querySelectorAll('button,[role="button"],[data-floating-control]')].filter(el => { if (el.closest(`#${ROOT_ID}`)) return false; const s = getComputedStyle(el), r = el.getBoundingClientRect(); return (s.position === 'fixed' || s.position === 'sticky') && r.right > innerWidth - 220 && r.bottom > innerHeight - 220; }).map(el => el.getBoundingClientRect()); outer: for (let y=16;y<=320;y+=8) for (let x=16;x<=320;x+=8) { const l=innerWidth-x-48,t=innerHeight-y-48; if (!controls.some(r => l < r.right && l+48 > r.left && t < r.bottom && t+48 > r.top)) { right=x; bottom=y; break outer; } } setDock(right,bottom); saveDock(); }
        function start() { if (document.getElementById(ROOT_ID)) return; rebuildMatcher(); installStyle(); buildUi(); const begin = () => { if (domSafeForHighlight) return; domSafeForHighlight = true; refresh(); }; const afterLoad = () => typeof requestIdleCallback === 'function' ? requestIdleCallback(begin, { timeout: 1200 }) : setTimeout(begin, 400); if (document.readyState === 'complete') afterLoad(); else { addEventListener('load', afterLoad, { once:true }); setTimeout(afterLoad, 2500); } }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true }); else start();
    }

    const CASE_INSENSITIVE = true;
    const WHOLE_WORDS_ONLY = true;

    const IGNORED_ELEMENTS = new Set([
        'SCRIPT', 'STYLE', 'NOSCRIPT',
        'TEXTAREA', 'INPUT', 'SELECT', 'OPTION',
        'CODE', 'PRE', 'KBD', 'SAMP',
        'SVG', 'MATH'
    ]);

    const HIGHLIGHT_CLASS = '__pride_flag_highlight';
    const SCRIPT_VERSION = '1.5.1';
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

    // False until after load/idle so we do not rewrite DOM during hydration.

    const DEFAULT_SETTINGS = Object.freeze({
        enabled: true,
        style: 'gradient', // 'gradient' | 'underline' | 'background'
        intensity: 'balanced', // 'subtle' | 'balanced' | 'vivid'
        showLabels: true,
        reducedMotion: false,
        highContrast: false,
        visibleOnly: false,
        disabledFlags: Object.freeze([]),
        excludedHosts: Object.freeze([])
    });

    function defaultSettings() {
        return {
            enabled: DEFAULT_SETTINGS.enabled,
            style: DEFAULT_SETTINGS.style,
            intensity: DEFAULT_SETTINGS.intensity,
            showLabels: DEFAULT_SETTINGS.showLabels,
            reducedMotion: DEFAULT_SETTINGS.reducedMotion,
            highContrast: DEFAULT_SETTINGS.highContrast,
            visibleOnly: DEFAULT_SETTINGS.visibleOnly,
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
            style: ['gradient', 'underline', 'background'].includes(source.style) ? source.style : 'gradient',
            intensity: ['subtle', 'balanced', 'vivid'].includes(source.intensity) ? source.intensity : 'balanced',
            showLabels: source.showLabels !== false,
            reducedMotion: source.reducedMotion === true,
            highContrast: source.highContrast === true,
            visibleOnly: source.visibleOnly === true,
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
.${HIGHLIGHT_CLASS}[data-pfh-style="background"] {
  color: #171b24 !important;
  -webkit-text-fill-color: #171b24 !important;
  background-image: var(--pfh-gradient) !important;
  background-clip: padding-box !important;
  border-radius: 0.25em;
  padding: 0 0.16em !important;
}
.${HIGHLIGHT_CLASS}[data-pfh-intensity="subtle"] { filter: saturate(.68); }
.${HIGHLIGHT_CLASS}[data-pfh-intensity="vivid"] { filter: saturate(1.18) contrast(1.04); }
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
.${HIGHLIGHT_CLASS}[data-pfh-label-position="above"]::after { top: auto; bottom: calc(100% + 6px); }
.${HIGHLIGHT_CLASS}[data-pfh-label-align="left"]::after { left: 0; transform: translateX(0) translateY(2px); }
.${HIGHLIGHT_CLASS}[data-pfh-label-align="right"]::after { left: auto; right: 0; transform: translateX(0) translateY(2px); }
.${HIGHLIGHT_CLASS}[data-pfh-label="1"]:hover::after,
.${HIGHLIGHT_CLASS}[data-pfh-label="1"]:focus-visible::after {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}
.${HIGHLIGHT_CLASS}[data-pfh-label="1"][data-pfh-label-align="left"]:hover::after,
.${HIGHLIGHT_CLASS}[data-pfh-label="1"][data-pfh-label-align="left"]:focus-visible::after,
.${HIGHLIGHT_CLASS}[data-pfh-label="1"][data-pfh-label-align="right"]:hover::after,
.${HIGHLIGHT_CLASS}[data-pfh-label="1"][data-pfh-label-align="right"]:focus-visible::after { transform: translateX(0) translateY(0); }
@media (prefers-reduced-motion: reduce) {
  #${UI_ROOT_ID} *, .${HIGHLIGHT_CLASS}[data-pfh-label="1"]::after { transition: none !important; }
}
#${UI_ROOT_ID}[data-pfh-motion="1"] *, #${UI_ROOT_ID}[data-pfh-motion="1"] .${HIGHLIGHT_CLASS}[data-pfh-label="1"]::after { transition: none !important; }
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
#${UI_ROOT_ID}[data-pfh-contrast="1"] .pfh-panel { border-color: #fff; box-shadow: 0 0 0 2px #fff, 0 16px 40px rgba(0,0,0,.65); }
#${UI_ROOT_ID}[data-pfh-contrast="1"] .pfh-switch-track { border: 2px solid #fff; }
#${UI_ROOT_ID}[data-pfh-contrast="1"] .pfh-panel, #${UI_ROOT_ID}[data-pfh-contrast="1"] .pfh-fab { color: #fff; }
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
#${UI_ROOT_ID} .pfh-status { color: #8fe3a6; font-size: .72rem; margin-top: 2px; }
#${UI_ROOT_ID} .pfh-status[data-excluded="1"] { color: #ffb0b0; }
#${UI_ROOT_ID} .pfh-panel {
  position: fixed;
  right: 16px;
  bottom: 68px;
  z-index: 2147483647;
  width: min(312px, calc(100vw - 24px));
  max-height: min(68vh, 500px);
  box-sizing: border-box;
  overflow-y: auto;
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
#${UI_ROOT_ID} .pfh-panel-head { padding-top: 14px; padding-bottom: 10px; }
#${UI_ROOT_ID} .pfh-subtitle { margin: 0; color: rgba(242,244,248,0.66); font-size: 0.76rem; }
#${UI_ROOT_ID} .pfh-quick { display: flex; gap: 3px; margin-top: 8px; }
#${UI_ROOT_ID} .pfh-quick button { flex: 1; min-height: 26px; padding: 0 5px; border: 1px solid rgba(255,255,255,.16); border-radius: 6px; background: #1c2230; color: #cfd7e6; cursor: pointer; font: 600 .7rem system-ui, sans-serif; }
#${UI_ROOT_ID} .pfh-quick button[aria-pressed="true"] { color: #10131a; border-color: transparent; background: linear-gradient(100deg, #ff8fbd, #ffe071, #77dfff); }
#${UI_ROOT_ID} .pfh-quick button:focus-visible { outline: 2px solid #9bdcff; outline-offset: 1px; }
#${UI_ROOT_ID} .pfh-section { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; padding-bottom: 8px; }
#${UI_ROOT_ID} .pfh-section-title { color: rgba(242,244,248,0.6); font-size: 0.68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; margin: 0 0 4px; }
#${UI_ROOT_ID} .pfh-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  min-height: 30px;
  font-size: 0.86rem;
}
#${UI_ROOT_ID} .pfh-row + .pfh-row { border-top: 1px solid rgba(255,255,255,0.06); }
#${UI_ROOT_ID} .pfh-row-main { min-height: 40px; font-weight: 700; }
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
#${UI_ROOT_ID} .pfh-flag-search { width: 100%; margin: 0 0 6px; padding: 6px 8px; border: 1px solid rgba(255,255,255,.15); border-radius: 7px; background: #171c27; color: #f2f4f8; font: .78rem system-ui, sans-serif; }
#${UI_ROOT_ID} .pfh-flag-search::placeholder { color: rgba(242,244,248,.5); }
#${UI_ROOT_ID} .pfh-flag-search:focus-visible { outline: 2px solid #9bdcff; outline-offset: 1px; }
#${UI_ROOT_ID} .pfh-flag-empty { color: rgba(242,244,248,.6); font-size: .76rem; padding: 8px 0; }
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
  padding-top: 8px;
  padding-bottom: 10px;
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
        span.dataset.pfhIntensity = settings.intensity;
        span.dataset.pfhLabel = settings.showLabels ? '1' : '0';
        span.dataset.pfhId = flag.id;
        span.style.setProperty('--pfh-gradient', flagGradient(flag.colors));
        span.tabIndex = 0;
        span.addEventListener('pointerenter', () => {
            const rect = span.getBoundingClientRect();
            span.dataset.pfhLabelPosition = rect.top < 42 ? 'below' : (rect.bottom + 42 > window.innerHeight ? 'above' : 'below');
            span.dataset.pfhLabelAlign = rect.left < 110 ? 'left' : (rect.right > window.innerWidth - 110 ? 'right' : 'center');
        }, { passive: true });
        span.addEventListener('click', (event) => {
            if (span.closest('a')) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            if (navigator.clipboard?.writeText) {
                navigator.clipboard.writeText(flag.label).then(() => showToast(`Copied ${flag.label}`)).catch(() => {});
            }
        });
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
        if (!domSafeForHighlight || !highlightingActive() || !node?.parentElement) {
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

        try {
            if (node.parentNode !== parent) {
                return;
            }
            parent.replaceChild(fragment, node);
        } catch (_err) {
            // Framework removed/replaced the node mid-flight — ignore.
        }
        regex.lastIndex = 0;
    }

    function acceptTextNode(node) {
        const parent = node.parentElement;
        if (!parent || shouldSkipParent(parent)) {
            return NodeFilter.FILTER_REJECT;
        }
        if (settings.visibleOnly) {
            const rect = parent.getBoundingClientRect();
            if (rect.bottom <= 0 || rect.top >= window.innerHeight || rect.right <= 0 || rect.left >= window.innerWidth) {
                return NodeFilter.FILTER_REJECT;
            }
        }
        return NodeFilter.FILTER_ACCEPT;
    }

    function processElement(element) {
        if (!domSafeForHighlight || !highlightingActive()) {
            return;
        }
        if (!element || (element.nodeType !== Node.ELEMENT_NODE && element.nodeType !== Node.DOCUMENT_FRAGMENT_NODE)) {
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

    let pendingMutations = [];
    let mutationFlushTimer = 0;

    function flushPendingMutations() {
        mutationFlushTimer = 0;
        if (!domSafeForHighlight || !highlightingActive()) {
            pendingMutations = [];
            return;
        }

        const batch = pendingMutations;
        pendingMutations = [];

        for (const mutation of batch) {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType === Node.ELEMENT_NODE) {
                    if (isUiNode(addedNode)) {
                        continue;
                    }
                    processElement(addedNode);
                    registerShadowRoots(addedNode);
                } else if (addedNode.nodeType === Node.TEXT_NODE) {
                    processTextNode(addedNode);
                }
            }

            if (mutation.type === 'characterData') {
                processTextNode(mutation.target);
            }
        }
    }

    const observer = new MutationObserver(mutations => {
        if (!domSafeForHighlight || !highlightingActive()) {
            return;
        }

        pendingMutations.push(...mutations);
        if (!mutationFlushTimer) {
            mutationFlushTimer = window.setTimeout(flushPendingMutations, 48);
        }
    });

    const observedShadowRoots = new Set();
    function registerShadowRoot(root) {
        if (!root || observedShadowRoots.has(root)) {
            return;
        }
        observedShadowRoots.add(root);
        if (domSafeForHighlight) {
            observer.observe(root, OBSERVER_OPTIONS);
            processElement(root);
        }
    }

    // Discover open shadow roots without patching Element.prototype.attachShadow.
    // Monkey-patching attachShadow at document-start breaks some modern sites.
    function registerShadowRoots(root) {
        if (!root) {
            return;
        }
        if (root.nodeType === Node.ELEMENT_NODE && root.shadowRoot) {
            registerShadowRoot(root.shadowRoot);
        }
        if (!root.querySelectorAll) {
            return;
        }
        // Only scan the added subtree's elements that already expose .shadowRoot.
        // Avoid full-document * walks on every mutation (freezes heavy SPAs).
        try {
            for (const el of root.querySelectorAll('*')) {
                if (el.shadowRoot) {
                    registerShadowRoot(el.shadowRoot);
                }
            }
        } catch (_err) {
            // ignore cross-origin / detached trees
        }
    }

    function startObserving() {
        if (!document.body) {
            return;
        }
        observer.observe(document.body, OBSERVER_OPTIONS);
        registerShadowRoots(document.body);
    }

    function reprocessAll() {
        observer.disconnect();
        pendingMutations = [];
        if (mutationFlushTimer) {
            clearTimeout(mutationFlushTimer);
            mutationFlushTimer = 0;
        }
        if (document.body) {
            clearHighlights(document.body);
        }
        for (const root of observedShadowRoots) clearHighlights(root);
        rebuildMatcher();
        installStyle();
        if (!domSafeForHighlight) {
            return;
        }
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

        uiRoot.dataset.pfhContrast = settings.highContrast ? '1' : '0';
        uiRoot.dataset.pfhMotion = settings.reducedMotion ? '1' : '0';

        panelEl.querySelector('#pfh-enabled').checked = settings.enabled;
        panelEl.querySelector('#pfh-style').value = settings.style;
        panelEl.querySelector('#pfh-intensity').value = settings.intensity;
        uiRoot.querySelectorAll('.pfh-quick button').forEach(button => {
            button.setAttribute('aria-pressed', button.dataset.style === settings.style ? 'true' : 'false');
        });
        panelEl.querySelector('#pfh-labels').checked = settings.showLabels;
        panelEl.querySelector('#pfh-reduced-motion').checked = settings.reducedMotion;
        panelEl.querySelector('#pfh-high-contrast').checked = settings.highContrast;
        panelEl.querySelector('#pfh-visible-only').checked = settings.visibleOnly;
        panelEl.querySelector('#pfh-exclude-site').checked = isSiteExcluded();

        const hostNote = panelEl.querySelector('#pfh-host-note');
        if (hostNote) {
            const host = currentHost() || '(unknown host)';
            hostNote.textContent = `Current site: ${host}`;
        }
        const status = panelEl.querySelector('#pfh-site-status');
        if (status) {
            const excluded = isSiteExcluded();
            status.textContent = excluded ? 'Highlighting paused on this site' : 'Highlighting active on this site';
            status.dataset.excluded = excluded ? '1' : '0';
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
            intensity: panelEl.querySelector('#pfh-intensity').value,
            showLabels: panelEl.querySelector('#pfh-labels').checked,
            reducedMotion: panelEl.querySelector('#pfh-reduced-motion').checked,
            highContrast: panelEl.querySelector('#pfh-high-contrast').checked,
            visibleOnly: panelEl.querySelector('#pfh-visible-only').checked,
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

    function savedFabPosition() {
        try {
            const raw = localStorage.getItem(FAB_POSITION_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (parsed && Number.isFinite(parsed.right) && Number.isFinite(parsed.bottom)) {
                return { right: Math.max(FAB_MARGIN, parsed.right), bottom: Math.max(FAB_MARGIN, parsed.bottom) };
            }
            // Migrate the previous bottom-only format without losing the user's placement.
            const legacyBottom = Number(raw);
            return Number.isFinite(legacyBottom) && legacyBottom >= FAB_MARGIN
                ? { right: FAB_MARGIN, bottom: legacyBottom }
                : null;
        } catch (_err) {
            return null;
        }
    }

    function saveFabPosition(right, bottom) {
        try {
            localStorage.setItem(FAB_POSITION_KEY, JSON.stringify({ right, bottom }));
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
        // Targeted scan — never walk every node on heavy SPAs like Grok.
        const nodes = document.body
            ? document.body.querySelectorAll('button,[role="button"],[data-floating-control],a,[class*="float"],[class*="Fab"],[class*="fab"]')
            : [];

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
            const position = style.position;
            const isCornerButton = el.matches?.('button,[role="button"],[data-floating-control]') &&
                (rect.right > window.innerWidth - 180 || rect.left < 180) &&
                (rect.bottom > window.innerHeight - 180 || rect.top < 180);
            if (position !== 'fixed' && position !== 'sticky' && !isCornerButton) {
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

        const storedPosition = savedFabPosition();
        if (storedPosition !== null) {
            const right = Math.max(FAB_MARGIN, storedPosition.right);
            const bottom = Math.min(storedPosition.bottom, Math.max(FAB_MARGIN, window.innerHeight - FAB_SIZE - FAB_MARGIN));
            fabEl.style.right = `${right}px`;
            fabEl.style.bottom = `${bottom}px`;
            panelEl.style.right = `${right}px`;
            panelEl.style.bottom = `${bottom + FAB_SIZE + FAB_GAP}px`;
            return;
        }

        // Search in 8px increments so the dock can sit in the nearest open
        // slot beside another floating control instead of jumping a full
        // button-width away when the controls are not on the same grid.
        const step = FAB_GAP;
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
        // Remember the first safe slot so newly appearing controls cannot move the dock.
        saveFabPosition(chosenRight, chosenBottom);
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
            <div class="pfh-panel-head"><h2>Prism Pride Highlighter</h2><p class="pfh-subtitle">Reveal identity colour cues in page text.</p><div class="pfh-quick" aria-label="Quick highlight styles"><button type="button" data-style="gradient" aria-pressed="false">Gradient</button><button type="button" data-style="underline" aria-pressed="false">Underline</button><button type="button" data-style="background" aria-pressed="false">Soft fill</button></div></div>
            <div class="pfh-section">
                <div class="pfh-section-title">Protection</div>
                <div class="pfh-row pfh-row-main"><span class="pfh-row-copy">Highlight protection<span class="pfh-row-detail">Enable colour highlighting</span></span>${switchHtml('pfh-enabled', true, 'Enable highlight protection')}</div>
            </div>
        <div class="pfh-section">
            <div class="pfh-section-title">This site</div>
                <div class="pfh-row"><span class="pfh-row-copy">Exclude this site<span class="pfh-row-detail" id="pfh-host-note"></span><span class="pfh-status" id="pfh-site-status" role="status"></span></span>${switchHtml('pfh-exclude-site', false, 'Exclude this site')}</div>
            </div>
            <div class="pfh-section">
                <div class="pfh-section-title">Appearance</div>
                <div class="pfh-row"><span>Highlight style</span><select id="pfh-style" aria-label="Highlight style"><option value="gradient">Gradient text</option><option value="underline">Underline</option><option value="background">Soft background</option></select></div>
                <div class="pfh-row"><span>Intensity</span><select id="pfh-intensity" aria-label="Highlight intensity"><option value="subtle">Subtle</option><option value="balanced">Balanced</option><option value="vivid">Vivid</option></select></div>
                <div class="pfh-row"><span>Hover labels</span>${switchHtml('pfh-labels', true, 'Show hover labels')}</div>
            </div>
            <div class="pfh-section">
                <details class="pfh-details"><summary>Flag visibility</summary><input id="pfh-flag-search" class="pfh-flag-search" type="search" placeholder="Search 59 flags" aria-label="Search flags" /><div class="pfh-flags">${buildFlagChecklistHtml()}</div></details>
            </div>
            <div class="pfh-section">
                <details class="pfh-details"><summary>Accessibility</summary>
                    <div class="pfh-row"><span>Reduce motion</span>${switchHtml('pfh-reduced-motion', false, 'Reduce motion')}</div>
                    <div class="pfh-row"><span>High contrast</span>${switchHtml('pfh-high-contrast', false, 'Use high contrast')}</div>
                    <div class="pfh-row"><span>Only process visible content</span>${switchHtml('pfh-visible-only', false, 'Only process visible content')}</div>
                </details>
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
            const startRight = Number.parseFloat(fabEl.style.right) || FAB_MARGIN;
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
                    saveFabPosition(startRight, Number.parseFloat(fabEl.style.bottom));
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
        panelEl.querySelector('#pfh-intensity').addEventListener('change', onChange);
        panelEl.querySelector('#pfh-labels').addEventListener('change', onChange);
        panelEl.querySelector('#pfh-reduced-motion').addEventListener('change', onChange);
        panelEl.querySelector('#pfh-high-contrast').addEventListener('change', onChange);
        panelEl.querySelector('#pfh-visible-only').addEventListener('change', onChange);
        panelEl.querySelector('.pfh-flags').addEventListener('change', onChange);
        panelEl.querySelector('#pfh-flag-search').addEventListener('input', (event) => {
            const query = event.target.value.trim().toLowerCase();
            for (const row of panelEl.querySelectorAll('.pfh-flags > label')) {
                row.hidden = query && !row.textContent.toLowerCase().includes(query);
            }
        });
        panelEl.querySelector('.pfh-quick').addEventListener('click', (event) => {
            const button = event.target.closest('button[data-style]');
            if (!button) return;
            const next = readPanelSettings();
            next.style = button.dataset.style;
            panelEl.querySelector('#pfh-style').value = next.style;
            applySettings(next);
        });
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

    // Wait until after load + a short idle so React/Next hydration can finish
    // before we rewrite text nodes. Early DOM edits are a common white-screen cause.
    let domSafeForHighlight = false;

    function markDomSafeAndHighlight() {
        if (domSafeForHighlight) {
            return;
        }
        domSafeForHighlight = true;
        for (const root of observedShadowRoots) {
            try {
                observer.observe(root, OBSERVER_OPTIONS);
                processElement(root);
            } catch (_err) {
                // detached
            }
        }
        reprocessAll();
    }

    function scheduleHighlightStart() {
        const run = () => markDomSafeAndHighlight();
        if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(run, { timeout: 1200 });
        } else {
            window.setTimeout(run, 400);
        }
    }

    function start() {
        buildUI();
        installStyle();
        rebuildMatcher();
        maybeShowVersionToast();

        // UI + styles only at DOMContentLoaded. Highlighting waits for load/idle.
        const afterLoad = () => scheduleHighlightStart();
        if (document.readyState === 'complete') {
            afterLoad();
        } else {
            window.addEventListener('load', afterLoad, { once: true });
            // Fallback if load is delayed forever (long-polling SPAs).
            window.setTimeout(afterLoad, 2500);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
        start();
    }

})();
