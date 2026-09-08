// ==UserScript==
// @name         Prism Pride Highlighter
// @namespace    prism.pride-highlighter
// @version      2.1.4
// @description  Reveals queer- and LGBTQ+-related words with their associated pride flag colours.
// @author       expDARE
// @license      CC BY-NC-SA 4.0
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @noframes
// @icon         https://raw.githubusercontent.com/ExtraPotions/vivid-prism-heron/v2.1.4/prism-pride-highlighter.svg
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
            words: ['queer', 'lgbtq', 'lgbtq+', 'lgbt', 'lgbt+', 'lgbtqia', 'lgbtqia+', 'pride flag', 'pride flags'],
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
            words: ['bisexual'],
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
            words: ['pansexual'],
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
            words: ['transgender'],
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
            words: ['asexual'],
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
            words: ['aromantic'],
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
            words: ['bear pride'],
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
            words: ['leather pride'],
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
            words: ['straight ally', 'lgbtq ally', 'lgbtq allies'],
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
     * RUNTIME
     * ============================================================
     *
     * Self-contained v2 implementation. The FLAGS catalogue above is
     * retained verbatim.
     */
    function polishedRuntime(flags) {
        const VERSION = '2.1.4';
        const SETTINGS_SCHEMA = 1;
        const SETTINGS_KEY = 'prism.pride-highlighter.settings';
        const LEGACY_KEY = 'pride.flag-highlighter.settings';
        const POSITION_KEY = 'prism.pride-highlighter.dock-position';
        const ROOT_ID = '__prism_pride_highlighter_v2';
        const HIT = 'pph-hit';
        const defaults = Object.freeze({
            enabled: true, style: 'gradient', intensity: 'balanced', labels: true,
            visibleOnly: false, reducedMotion: false, highContrast: false,
            disabledFlags: [], excludedHosts: [], shortcut: 'Alt+G'
        });
        const ignoredTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'BUTTON', 'CODE', 'PRE', 'KBD', 'SAMP', 'SVG', 'MATH']);
        let settings = loadSettings();
        let matcher = null;
        let wordMap = new Map();
        let uiRoot, fab, panel, uiShadow, highlightSheet, menuSheet, highlightCssText = '', menuCssText = '';
        let scanTimer = 0;
        let lastProcessed = 0;
        const diagnosticErrors = [];
        let domSafeForHighlight = false;
        let pendingMutations = [];
        let mutationTimer = 0;
        const roots = new Set();
        const observer = new MutationObserver(onMutations);

        function loadSettings() {
            try {
                const raw = localStorage.getItem(SETTINGS_KEY) || localStorage.getItem(LEGACY_KEY);
                const parsed = raw ? JSON.parse(raw) : defaults;
                const migrated = normalise(parsed);
                if (!parsed || parsed.schemaVersion !== SETTINGS_SCHEMA || !localStorage.getItem(SETTINGS_KEY)) {
                    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...migrated, schemaVersion: SETTINGS_SCHEMA }));
                }
                return migrated;
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
                excludedHosts: Array.isArray(source.excludedHosts) ? [...new Set(source.excludedHosts.filter(v => typeof v === 'string'))] : [],
                shortcut: normaliseShortcut(source.shortcut === undefined ? defaults.shortcut : source.shortcut)
            };
        }
        function save() { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...settings, schemaVersion: SETTINGS_SCHEMA })); } catch (_err) {} }
        function exportSettings() {
            const payload = { app: 'Prism Pride Highlighter', version: VERSION, schemaVersion: SETTINGS_SCHEMA, settings, dock: savedDock() };
            const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
            const link = document.createElement('a'); link.href = url; link.download = `prism-pride-highlighter-${VERSION}-settings.json`; link.click();
            setTimeout(() => URL.revokeObjectURL(url), 0); setStatus('Settings exported');
        }
        async function importSettings(file) {
            try {
                const payload = JSON.parse(await file.text());
                if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Invalid settings file');
                if (payload.app && payload.app !== 'Prism Pride Highlighter') throw new Error('Wrong settings file');
                const schema = Number(payload.schemaVersion ?? payload.settings?.schemaVersion ?? 0);
                if (!Number.isInteger(schema) || schema < 0 || schema > SETTINGS_SCHEMA) throw new Error('Unsupported settings schema');
                const source = payload?.settings && typeof payload.settings === 'object' ? payload.settings : payload;
                if (!source || typeof source !== 'object' || Array.isArray(source)) throw new Error('Invalid settings file');
                settings = normalise(source); save();
                if (payload?.dock && Number.isFinite(payload.dock.right) && payload.dock.right >= 0 && Number.isFinite(payload.dock.bottom) && payload.dock.bottom >= 0) {
                    localStorage.setItem(POSITION_KEY, JSON.stringify(payload.dock)); placeDock();
                }
                refresh(); setStatus('Settings imported');
            } catch (_err) { setStatus('Could not import that file', true); }
        }
        function setStatus(message, error = false) { const node = panel?.querySelector('#pph-message'); if (node) { node.textContent = message; node.dataset.error = error ? '1' : '0'; } }
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
#${ROOT_ID} select,#${ROOT_ID} .pph-actions button,#${ROOT_ID} .pph-transfer button{border:1px solid #ffffff30;border-radius:8px;background:#1c2230;color:#f2f4f8;padding:6px 8px;font-size:12px}#${ROOT_ID} details summary{display:flex;align-items:center;justify-content:space-between;min-height:32px;cursor:pointer;font:13px system-ui,sans-serif}#${ROOT_ID} details summary::after{content:"Show";color:#9bdcff;font-size:11px}#${ROOT_ID} details[open] summary::after{content:"Hide"}#${ROOT_ID} .pph-search{width:100%;margin:4px 0 7px;padding:7px 8px;border:1px solid #ffffff30;border-radius:7px;background:#171c27;color:#fff}#${ROOT_ID} .pph-flags{max-height:220px;overflow:auto;border:1px solid #ffffff1c;border-radius:9px;padding:0 8px}#${ROOT_ID} .pph-flag{display:flex;align-items:center;justify-content:space-between;min-height:30px;border-bottom:1px solid #ffffff12;font:12px system-ui,sans-serif}#${ROOT_ID} .pph-flag:last-child{border:0}#${ROOT_ID} .pph-swatch{width:13px;height:13px;border-radius:3px;background:var(--swatch);margin-right:7px;display:inline-block;vertical-align:-2px}#${ROOT_ID} .pph-transfer{display:flex;gap:6px;padding-top:4px}#${ROOT_ID} .pph-message{min-height:14px;margin:4px 0 0;color:#8fe3a6;font:11px/1.2 system-ui,sans-serif}#${ROOT_ID} .pph-message[data-error="1"]{color:#ffb0b0}#${ROOT_ID} .pph-version{align-self:center;color:#abb4c3;font:11px system-ui,sans-serif}#${ROOT_ID} .pph-actions{position:sticky;bottom:0;display:flex;gap:7px;justify-content:flex-end;padding-top:9px;padding-bottom:10px;border-top:1px solid #ffffff1c;background:#12141a}
@media (prefers-reduced-motion:reduce){#${ROOT_ID} *{transition:none!important;animation:none!important}}
`;
        }

        function applyStyle(target, sheet, cssText, key) {
            if (!target) return;
            if (sheet && 'adoptedStyleSheets' in target) {
                try {
                    if (!target.adoptedStyleSheets.includes(sheet)) target.adoptedStyleSheets = [...target.adoptedStyleSheets, sheet];
                    return;
                } catch (_err) {}
            }
            const owner = target === document ? (document.head || document.documentElement) : target;
            if (!owner || owner.querySelector?.(`style[data-pph-style="${key}"]`)) return;
            const style = document.createElement('style'); style.dataset.pphStyle = key; style.textContent = cssText; owner.append(style);
        }
        function installStyle() {
            if (!highlightCssText) {
                const source = css(), split = source.indexOf(`#${ROOT_ID}`);
                highlightCssText = source.slice(0, split);
                menuCssText = source.slice(split).replaceAll(`#${ROOT_ID}`, ':host').replace(/:host(\[[^\]]+\])/g,':host($1)') + `
                  :host{position:fixed;width:48px;height:48px;z-index:2147483647;pointer-events:none;color-scheme:dark}
                  *,*::before,*::after{box-sizing:border-box} [hidden]{display:none!important}
                  .pph-panel{font:13px/1.4 system-ui,sans-serif!important;background:#282826!important;color:#e5e5e0!important;pointer-events:auto;max-height:calc(100dvh - 84px)!important}
                  :host .pph-fab{position:absolute;inset:0;pointer-events:auto}
                  :host .pph-fab svg{display:block;width:100%;height:100%;pointer-events:none}
                  :host .pph-actions{background:#282826}
                  :host .pph-panel{width:min(312px,calc(100vw - 32px))}
                  :host h2{font-size:15px}
                  :host .pph-row{min-height:34px;line-height:1.4}
                  :host .pph-row+.pph-row{border-top:1px solid #ffffff0c}
                  :host .pph-section{padding-top:9px;padding-bottom:9px}
                  :host details summary{display:list-item;min-height:30px;align-content:center}
                  :host details summary::after{display:none}
                  :host button,:host select,:host input{font:12px/1.4 system-ui,sans-serif;text-shadow:none;box-shadow:none}
                  :host button:not(.pph-switch):not(.pph-fab){cursor:pointer}
                  :host select{max-width:155px}
                  :host .pph-switch{appearance:none;position:relative;display:block;width:36px;height:20px;padding:0;border:1px solid #8d95a1;border-radius:99px;background:#596171;color:#fff;flex:0 0 36px}
                  :host .pph-switch::after{content:'';position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .15s}
                  :host .pph-switch[aria-checked=true]{background:linear-gradient(90deg,#e66aa1,#67cfff,#a185f5)}
                  :host .pph-switch[aria-checked=true]::after{transform:translateX(16px)}
                  :host([data-motion="1"]) *::before,:host([data-motion="1"]) *::after{transition:none!important;animation:none!important}
                  @media(prefers-reduced-motion:reduce){:host *::before,:host *::after{transition:none!important;animation:none!important}}
                  :host :is(button,select,input,summary):focus-visible{outline:2px solid #9bdcff;outline-offset:2px}
                  :host input::placeholder{color:#c3cad6;opacity:1}
                  :host([data-contrast="1"]) .pph-switch{background:#000;border-color:#fff}
                  :host([data-contrast="1"]) .pph-switch[aria-checked=true]{background:#fff}
                  :host([data-contrast="1"]) .pph-switch[aria-checked=true]::after{background:#000}
                  @media(prefers-contrast:more){:host .pph-panel{border:2px solid white}:host .pph-switch{background:#000;border-color:#fff}:host .pph-switch[aria-checked=true]{background:#fff}:host .pph-switch[aria-checked=true]::after{background:#000}}
                  @media(forced-colors:active){:host .pph-panel{background:Canvas!important;color:CanvasText!important}:host .pph-switch{forced-color-adjust:none;background:Canvas;border-color:ButtonText}:host .pph-switch::after{background:ButtonText}:host .pph-switch[aria-checked=true]{background:Highlight}:host .pph-switch[aria-checked=true]::after{background:HighlightText}}
                `;
                if (typeof CSSStyleSheet === 'function' && CSSStyleSheet.prototype?.replaceSync) {
                    try { highlightSheet = new CSSStyleSheet(); highlightSheet.replaceSync(highlightCssText); menuSheet = new CSSStyleSheet(); menuSheet.replaceSync(menuCssText); }
                    catch (_err) { highlightSheet = null; menuSheet = null; }
                }
            }
            applyStyle(document, highlightSheet, highlightCssText, 'document');
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
        function observeRoot(root) { if (!root || root===uiShadow || root.host?.matches('#theme-picker-root') || roots.has(root)) return; roots.add(root); applyStyle(root, highlightSheet, highlightCssText, 'highlight'); observer.observe(root, { childList:true, subtree:true, characterData:true }); scan(root); }
        function flushMutations() { mutationTimer = 0; if (!active()) { pendingMutations = []; return; } const batch = pendingMutations; pendingMutations = []; for (const mutation of batch) { if (mutation.type === 'characterData') processText(mutation.target); for (const node of mutation.addedNodes) { if (node.nodeType === Node.TEXT_NODE) processText(node); if (node.nodeType === Node.ELEMENT_NODE && node.id !== ROOT_ID) scan(node); } } }
        function onMutations(mutations) { if (!active()) return; pendingMutations.push(...mutations); if (!mutationTimer) mutationTimer = window.setTimeout(flushMutations, 48); }
        function refresh() { try { observer.disconnect(); pendingMutations = []; if (mutationTimer) { clearTimeout(mutationTimer); mutationTimer = 0; } clear(document.body); for (const root of roots) clear(root); rebuildMatcher(); installStyle(); if (!domSafeForHighlight) { syncUi(); return; } if (active()) scan(document.body); observer.observe(document.body, { childList:true, subtree:true, characterData:true }); for (const root of roots) observer.observe(root, { childList:true, subtree:true, characterData:true }); lastProcessed=Date.now();syncUi(); } catch(error) { diagnosticErrors.push(String(error?.message||error));syncUi(); } }
        function diagnosticText(){return [`Prism Pride Highlighter ${VERSION}`,`Site: ${host()||'(unknown)'}`,`Page: ${location.pathname||'/'}`,`Active identities: ${flags.length-settings.disabledFlags.length}`,`Highlights: ${document.querySelectorAll('.'+HIT).length}`,`Last processed: ${lastProcessed?new Date(lastProcessed).toISOString():'Not yet'}`,`Errors: ${diagnosticErrors.length}${diagnosticErrors.length?' · '+diagnosticErrors.at(-1):''}`].join('\n');}
        function refreshDiagnostics(){const out=panel?.querySelector('#pph-diagnostics');if(out)out.textContent=diagnosticText();}
        function scheduleVisibleScan() { if (!settings.visibleOnly || scanTimer) return; scanTimer = requestAnimationFrame(() => { scanTimer = 0; scan(document.body); }); }

        function switchMarkup(id, checked, label) { return `<button class="pph-switch" id="${id}" type="button" role="switch" aria-checked="${checked}" aria-label="${label}"></button>`; }
        function flagMarkup() { return flags.map(flag => `<label class="pph-flag"><span><i class="pph-swatch" style="--swatch:linear-gradient(180deg,${flag.colors.join(',')})"></i>${flag.label}</span>${switchMarkup(`pph-flag-${flag.id}`, !settings.disabledFlags.includes(flag.id), `Show ${flag.label}`)}</label>`).join(''); }
        const LAUNCHER_PROTOCOL='userscript-launcher-v1';
        function normaliseShortcut(value){if(typeof value!=='string')return defaults.shortcut;const raw=value.trim();if(!raw||/^off$/i.test(raw))return '';const parts=raw.split('+').map(v=>v.trim()).filter(Boolean),key=parts.pop();if(!key)return '';const mods=['Ctrl','Alt','Shift','Meta'].filter(mod=>parts.some(v=>v.toLowerCase()===mod.toLowerCase()));return [...mods,key.length===1?key.toUpperCase():key].join('+');}
        function eventShortcut(event){return [...(event.ctrlKey?['Ctrl']:[]),...(event.altKey?['Alt']:[]),...(event.shiftKey?['Shift']:[]),...(event.metaKey?['Meta']:[]),event.key.length===1?event.key.toUpperCase():event.key].join('+');}
        function editableTarget(target){return target?.matches?.('input,textarea,select,[contenteditable="true"]');}
        function declareLauncher(node,controls,meta){
            node.dataset.userscriptLauncher=LAUNCHER_PROTOCOL;node.dataset.launcherOwner=meta.owner;node.dataset.launcherId=meta.id;node.dataset.launcherPriority=String(meta.priority);node.dataset.launcherPreferredPosition=meta.preferredPosition;
            let frame=0;const publish=()=>{frame=0;const rects=controls().filter(el=>el?.isConnected&&el.getClientRects().length).map(el=>el.getBoundingClientRect());if(!rects.length)return;const area={left:Math.round(Math.min(...rects.map(r=>r.left))),top:Math.round(Math.min(...rects.map(r=>r.top))),right:Math.round(Math.max(...rects.map(r=>r.right))),bottom:Math.round(Math.max(...rects.map(r=>r.bottom)))};node.dataset.launcherOccupiedArea=JSON.stringify(area);window.dispatchEvent(new CustomEvent('userscript-launcher:change',{detail:{protocol:LAUNCHER_PROTOCOL,owner:meta.owner,id:meta.id,priority:meta.priority,preferredPosition:meta.preferredPosition,occupiedArea:area}}));};
            const schedule=()=>{if(!frame)frame=requestAnimationFrame(publish);};if(typeof ResizeObserver!=='undefined'){const observer=new ResizeObserver(schedule);for(const el of controls().filter(Boolean))observer.observe(el);}window.addEventListener('resize',schedule,{passive:true});const checkCollision=()=>{let own=[];try{own=JSON.parse(node.dataset.launcherShortcuts||'[]');}catch{}const collision=[...document.querySelectorAll('[data-userscript-launcher="userscript-launcher-v1"]')].some(el=>{if(el===node)return false;try{return JSON.parse(el.dataset.launcherShortcuts||'[]').some(value=>own.includes(value));}catch{return false;}});node.dataset.launcherShortcutCollision=String(collision);};window.addEventListener('userscript-launcher:change',checkCollision);queueMicrotask(checkCollision);return{publish:schedule};
        }
        function buildUi() {
            uiRoot = document.createElement('div'); uiRoot.id = ROOT_ID; uiRoot.className='pfh-fab'; uiRoot.setAttribute('data-floating-control','companion');
            uiRoot.dataset.expdareControl='secondary';uiRoot.dataset.expdareDockRoot='secondary';
            uiRoot.style.cssText='all:initial!important;position:fixed!important;width:48px!important;height:48px!important;z-index:2147483647!important;pointer-events:none!important';
            uiShadow=uiRoot.attachShadow({mode:'open'});applyStyle(uiShadow, menuSheet, menuCssText, 'menu');
            fab = document.createElement('button'); fab.className = 'pph-fab'; fab.type = 'button'; fab.setAttribute('aria-label', 'Prism Pride Highlighter settings'); fab.setAttribute('aria-expanded', 'false');
            // Inline copy of the repository icon: no image request or CSP dependency.
            fab.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="refraction" x1="12" y1="11" x2="52" y2="53" gradientUnits="userSpaceOnUse"><stop stop-color="#ff4f9a"/><stop offset=".3" stop-color="#ffd54a"/><stop offset=".56" stop-color="#55d6ff"/><stop offset=".78" stop-color="#8d6cff"/><stop offset="1" stop-color="#ff6aa2"/></linearGradient><linearGradient id="facet" x1="21" y1="18" x2="42" y2="43" gradientUnits="userSpaceOnUse"><stop stop-color="#fff"/><stop offset="1" stop-color="#dce8ff"/></linearGradient></defs><rect width="64" height="64" rx="15" fill="#121722"/><path d="M32 10 37 27 54 32 37 37 32 54 27 37 10 32 27 27Z" fill="url(#refraction)"/><path d="m32 17 4.7 11.3L47 32l-10.3 3.7L32 47l-4.7-11.3L17 32l10.3-3.7Z" fill="url(#facet)"/><path d="m32 20 2.8 9.2L44 32l-9.2 2.8L32 44l-2.8-9.2L20 32l9.2-2.8Z" fill="#f8fbff"/></svg>`;
            panel = document.createElement('aside'); panel.className = 'pph-panel'; panel.id='pph-panel';panel.setAttribute('role','dialog'); panel.setAttribute('aria-label', 'Prism Pride Highlighter settings'); fab.setAttribute('aria-controls',panel.id);
            panel.innerHTML = `<div class="pph-head"><h2>Prism Pride Highlighter</h2><p class="pph-sub">Reveal identity colour cues in page text.</p><div class="pph-quick" aria-label="Quick style buttons"><button data-style="gradient">Gradient</button><button data-style="underline">Underline</button><button data-style="background">Soft fill</button></div></div><section class="pph-section"><div class="pph-title">Protection</div><div class="pph-row"><span class="pph-copy"><b>Highlight protection</b><span class="pph-detail">Enable colour highlighting</span></span>${switchMarkup('pph-enabled', settings.enabled, 'Enable highlighting')}</div></section><section class="pph-section"><div class="pph-title">This site</div><div class="pph-row"><span class="pph-copy">Exclude this site<span id="pph-host" class="pph-detail"></span><span id="pph-status" class="pph-detail pph-status" role="status"></span></span>${switchMarkup('pph-exclude', excluded(), 'Exclude this site')}</div></section><section class="pph-section"><div class="pph-title">Appearance</div><div class="pph-row"><span>Highlight style</span><select id="pph-style"><option value="gradient">Gradient text</option><option value="underline">Underline</option><option value="background">Soft background</option></select></div><div class="pph-row"><span>Intensity</span><select id="pph-intensity"><option value="subtle">Subtle</option><option value="balanced">Balanced</option><option value="vivid">Vivid</option></select></div><div class="pph-row"><span>Hover labels</span>${switchMarkup('pph-labels', settings.labels, 'Show hover labels')}</div></section><section class="pph-section"><details><summary>Performance & accessibility</summary><div class="pph-row"><span>Only process visible content</span>${switchMarkup('pph-visible', settings.visibleOnly, 'Only process visible content')}</div><div class="pph-row"><span>Reduce motion</span>${switchMarkup('pph-motion', settings.reducedMotion, 'Reduce motion')}</div><div class="pph-row"><span>High contrast</span>${switchMarkup('pph-contrast', settings.highContrast, 'High contrast')}</div><div class="pph-row"><label for="pph-shortcut">Open menu shortcut</label><input id="pph-shortcut" type="text" placeholder="Off" aria-label="Open menu shortcut"></div></details></section><section class="pph-section"><details><summary>Flag visibility</summary><input id="pph-search" class="pph-search" type="search" placeholder="Search ${flags.length} flags" aria-label="Search flags"><div class="pph-flags">${flagMarkup()}</div></details></section><section class="pph-section"><details><summary>Settings backup</summary><div class="pph-transfer"><button id="pph-export" type="button">Export</button><button id="pph-import" type="button">Import</button><input id="pph-import-file" type="file" accept="application/json,.json" hidden></div><p id="pph-message" class="pph-message" role="status" aria-live="polite"></p></details></section><section class="pph-section"><details><summary>About & diagnostics</summary><pre id="pph-diagnostics" class="pph-message"></pre><div class="pph-transfer"><button id="pph-copy-diagnostics" type="button">Copy diagnostics</button></div></details></section><footer class="pph-actions"><span class="pph-version">v${VERSION}</span><button id="pph-reset" type="button">Reset defaults</button><button id="pph-close" type="button">Close</button></footer>`;
            for(const button of panel.querySelectorAll('[role=switch]'))Object.defineProperty(button,'checked',{get(){return this.getAttribute('aria-checked')==='true';},set(value){this.setAttribute('aria-checked',String(Boolean(value)));}});
            panel.querySelector('#pph-style').setAttribute('aria-label','Highlight style');panel.querySelector('#pph-intensity').setAttribute('aria-label','Intensity');
            uiShadow.append(panel, fab); (document.body || document.documentElement).append(uiRoot); const launcher=declareLauncher(uiRoot,()=>[fab,panel],{owner:'expDARE',id:'prism-pride-highlighter',priority:50,preferredPosition:'right-bottom'}); placeDock(); bindUi(); syncUi();launcher.publish();
            new MutationObserver(positionPanel).observe(uiRoot,{attributes:true,attributeFilter:['style']});
        }
        function readUi() {
            const disabled = flags.filter(flag => !panel.querySelector(`#pph-flag-${CSS.escape(flag.id)}`)?.checked).map(flag => flag.id);
            const hosts = settings.excludedHosts.filter(value => value !== host()); if (panel.querySelector('#pph-exclude').checked && host()) hosts.push(host());
            return normalise({ enabled: panel.querySelector('#pph-enabled').checked, style: panel.querySelector('#pph-style').value, intensity: panel.querySelector('#pph-intensity').value, labels: panel.querySelector('#pph-labels').checked, visibleOnly: panel.querySelector('#pph-visible').checked, reducedMotion: panel.querySelector('#pph-motion').checked, highContrast: panel.querySelector('#pph-contrast').checked, shortcut:panel.querySelector('#pph-shortcut').value, disabledFlags: disabled, excludedHosts: hosts });
        }
        function apply(next) { settings = next; save(); refresh(); }
        function syncUi() {
            if (!panel) return; uiRoot.dataset.contrast = settings.highContrast ? '1' : '0'; uiRoot.dataset.motion = settings.reducedMotion ? '1' : '0';
            panel.querySelector('#pph-enabled').checked = settings.enabled; panel.querySelector('#pph-exclude').checked = excluded(); panel.querySelector('#pph-style').value = settings.style; panel.querySelector('#pph-intensity').value = settings.intensity; panel.querySelector('#pph-labels').checked = settings.labels; panel.querySelector('#pph-visible').checked = settings.visibleOnly; panel.querySelector('#pph-motion').checked = settings.reducedMotion; panel.querySelector('#pph-contrast').checked = settings.highContrast;panel.querySelector('#pph-shortcut').value=settings.shortcut;uiRoot.dataset.launcherShortcuts=JSON.stringify(settings.shortcut?[settings.shortcut]:[]);
            panel.querySelectorAll('.pph-quick button').forEach(button => button.setAttribute('aria-pressed', button.dataset.style === settings.style ? 'true' : 'false'));
            for(const flag of flags)panel.querySelector(`#pph-flag-${CSS.escape(flag.id)}`).checked=!settings.disabledFlags.includes(flag.id);
            panel.querySelector('#pph-host').textContent = `Current site: ${host() || '(unknown)'}`; const status = panel.querySelector('#pph-status'); status.textContent = excluded() ? 'Highlighting paused on this site' : 'Highlighting active on this site'; status.dataset.excluded = excluded() ? '1' : '0';
            refreshDiagnostics();
        }
        function bindUi() {
            fab.addEventListener('click', event => { if (fab.dataset.dragged === '1') { delete fab.dataset.dragged; return; } togglePanel(panel.dataset.open !== '1'); });
            panel.addEventListener('change', () => apply(readUi()));
            panel.querySelector('#pph-shortcut').addEventListener('change',()=>{const collision=[...document.querySelectorAll('[data-userscript-launcher="userscript-launcher-v1"]')].some(el=>{if(el===uiRoot)return false;try{return JSON.parse(el.dataset.launcherShortcuts||'[]').includes(settings.shortcut);}catch{return false;}});setStatus(collision?'Shortcut is also used by another installed script.':'Shortcut saved.',collision);});
            panel.addEventListener('click',event=>{const button=event.target.closest('[role=switch]');if(button){button.checked=!button.checked;apply(readUi());}});
            panel.querySelector('.pph-quick').addEventListener('click', event => { const button = event.target.closest('button[data-style]'); if (!button) return; panel.querySelector('#pph-style').value = button.dataset.style; apply(readUi()); });
            panel.querySelector('#pph-search').addEventListener('input', event => { const query = event.target.value.trim().toLowerCase(); panel.querySelectorAll('.pph-flag').forEach(row => row.hidden = Boolean(query) && !row.textContent.toLowerCase().includes(query)); });
            panel.querySelector('#pph-close').addEventListener('click', () => togglePanel(false));
            panel.querySelector('#pph-export').addEventListener('click', exportSettings);
            panel.querySelector('#pph-copy-diagnostics').addEventListener('click',async()=>{const text=diagnosticText();try{await navigator.clipboard.writeText(text);setStatus('Diagnostics copied');}catch(_err){window.prompt('Copy diagnostics',text);}});
            panel.querySelector('#pph-import').addEventListener('click', () => panel.querySelector('#pph-import-file').click());
            panel.querySelector('#pph-import-file').addEventListener('change', event => { const [file] = event.target.files; if (file) importSettings(file); event.target.value = ''; });
            panel.querySelector('#pph-reset').addEventListener('click', () => { settings = { ...defaults, disabledFlags: [], excludedHosts: [] }; try { localStorage.removeItem(POSITION_KEY); } catch (_err) {} save(); placeDock(true); refresh(); });
            let startY = 0, startBottom = 0, moved = false;
            let startRight = 16;
            fab.addEventListener('pointerdown', event => { if (event.button !== 0) return; const hostRect = uiRoot.getBoundingClientRect(); startY = event.clientY; startRight = Math.max(16, innerWidth - hostRect.right); startBottom = innerHeight - hostRect.bottom; moved = false; fab.setPointerCapture(event.pointerId); });
            fab.addEventListener('pointermove', event => { if (!fab.hasPointerCapture(event.pointerId)) return; const delta = event.clientY - startY; if (Math.abs(delta) < 4) return; moved = true; const bottom = Math.max(16, Math.min(innerHeight - 64, startBottom - delta)); setDock(startRight, bottom); });
            fab.addEventListener('pointerup', event => { if (!fab.hasPointerCapture(event.pointerId)) return; fab.releasePointerCapture(event.pointerId); if (moved) { fab.dataset.dragged = '1'; saveDock(); } });
            fab.addEventListener('pointercancel', () => { moved = false; delete fab.dataset.dragged; });
            panel.addEventListener('toggle',positionPanel,true);
            document.addEventListener('pointerdown',event=>{if(panel.dataset.open==='1'&&!event.composedPath().includes(uiRoot))togglePanel(false);});
            document.addEventListener('keydown', event => { if (settings.shortcut&&!editableTarget(event.target)&&eventShortcut(event)===normaliseShortcut(settings.shortcut)) { event.preventDefault(); togglePanel(panel.dataset.open !== '1'); } else if (event.key === 'Escape'&&panel.dataset.open==='1') togglePanel(false); });
            panel.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const items=[...panel.querySelectorAll('button,select,input,summary')].filter(el=>el.getClientRects().length&&!el.disabled);const first=items[0],last=items.at(-1);if(event.shiftKey&&uiShadow.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&uiShadow.activeElement===last){event.preventDefault();first.focus();}});
            window.addEventListener('scroll', scheduleVisibleScan, { passive:true }); window.addEventListener('resize', () => { placeDock(); if (settings.visibleOnly) scheduleVisibleScan(); });
        }
        function togglePanel(open) { panel.dataset.open = open ? '1' : '0'; fab.setAttribute('aria-expanded', open ? 'true' : 'false');positionPanel(); if(open)panel.querySelector('button').focus();else fab.focus(); }
        function savedDock() { try { const value = JSON.parse(localStorage.getItem(POSITION_KEY)); return Number.isFinite(value?.right) && Number.isFinite(value?.bottom) ? value : null; } catch (_err) { return null; } }
        function saveDock() { const rect=uiRoot.getBoundingClientRect();try { localStorage.setItem(POSITION_KEY, JSON.stringify({ right: innerWidth-rect.right, bottom: innerHeight-rect.bottom })); } catch (_err) {} }
        function positionPanel(){if(!panel||!uiRoot)return;const r=uiRoot.getBoundingClientRect();panel.style.right=`${Math.max(12,Math.min(innerWidth-r.right,innerWidth-324))}px`;panel.style.bottom='auto';panel.style.top=`${Math.max(12,Math.min(r.top-panel.offsetHeight-8,innerHeight-panel.offsetHeight-12))}px`;}
        function setDock(right, bottom) { right=Math.max(12,Math.min(right,innerWidth-60));bottom=Math.max(12,Math.min(bottom,innerHeight-60));fab.style.removeProperty('right');fab.style.removeProperty('bottom');uiRoot.style.setProperty('right',`${right}px`,'important');uiRoot.style.setProperty('bottom',`${bottom}px`,'important');uiRoot.style.removeProperty('left');uiRoot.style.removeProperty('top'); positionPanel(); }
        function placeDock(force = false) { const saved = !force && savedDock(); if (saved) return setDock(Math.max(16, saved.right), Math.max(16, Math.min(saved.bottom, innerHeight - 64))); let right = 16, bottom = 16; const controls = [...document.querySelectorAll('button,[role="button"],[data-floating-control]')].filter(el => { if (el.closest(`#${ROOT_ID}`)) return false; const s = getComputedStyle(el), r = el.getBoundingClientRect(); return (s.position === 'fixed' || s.position === 'sticky') && r.right > innerWidth - 220 && r.bottom > innerHeight - 220; }).map(el => el.getBoundingClientRect()); outer: for (let y=16;y<=320;y+=8) for (let x=16;x<=320;x+=8) { const l=innerWidth-x-48,t=innerHeight-y-48; if (!controls.some(r => l < r.right && l+48 > r.left && t < r.bottom && t+48 > r.top)) { right=x; bottom=y; break outer; } } setDock(right,bottom); saveDock(); }
        function start() { if (document.getElementById(ROOT_ID)) return; rebuildMatcher(); installStyle(); buildUi(); const begin = () => { if (domSafeForHighlight) return; domSafeForHighlight = true; refresh(); }; const afterLoad = () => typeof requestIdleCallback === 'function' ? requestIdleCallback(begin, { timeout: 1200 }) : setTimeout(begin, 400); if (document.readyState === 'complete') afterLoad(); else { addEventListener('load', afterLoad, { once:true }); setTimeout(afterLoad, 2500); } }
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once:true }); else start();
    }

    polishedRuntime(FLAGS);
})();
