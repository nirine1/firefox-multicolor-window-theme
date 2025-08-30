class BasicColorTheme {
    constructor(frame, isDarkMode = false) {
        this.frame = frame;
        this.isDarkMode = isDarkMode;
        this.usage = 0;
        this.lastUsed = Math.random();
    }

    get browserThemeObject() {
        if (this.isDarkMode) {
            return {
                colors: {
                    frame: this.frame,
                    frame_inactive: this.frame,
                    button_background_active: "#333333",
                    button_background_hover: "#282828",
                    bookmark_text: "rgba(255, 255, 255, 0.8)",
                    icons: "rgba(255, 255, 255, 0.8)",
                    ntp_background: "#000000",
                    ntp_text: "rgba(255, 255, 255, 0.8)",
                    popup: "#101010",
                    popup_border: "#303030",
                    popup_highlight: "#303030",
                    popup_highlight_text: "white",
                    popup_text: "rgba(255, 255, 255, 0.8)",
                    sidebar: "#101010",
                    sidebar_border: "#303030",
                    sidebar_highlight: "#303030",
                    sidebar_highlight_text: "white",
                    sidebar_text: "rgba(255, 255, 255, 0.8)",
                    tab_background_separator: "transparent",
                    tab_background_text: "#ffffff",
                    tab_loading: "white",
                    tab_line: "rgba(255, 255, 255, 0.05)",
                    tab_text: "#ffffff",
                    toolbar: "rgba(18, 18, 18, 0.8)",
                    toolbar_bottom_separator: "#101010",
                    toolbar_field: "#000000",
                    toolbar_field_border: "transparent",
                    toolbar_field_border_focus: "#303030",
                    toolbar_field_focus: "#111111",
                    toolbar_field_highlight: "#333333",
                    toolbar_field_highlight_text: "white",
                    toolbar_field_separator: "#101010",
                    toolbar_field_text: "rgba(255, 255, 255, 0.8)",
                    toolbar_field_text_focus: "white",
                    toolbar_top_separator: "rgba(18, 18, 18, 0.0)",
                    toolbar_vertical_separator: "rgba(255, 255, 255, 0.06)"
                }
            };
        } else {
            return {
                colors: {
                    frame: this.frame,
                    frame_inactive: this.frame,
                    button_background_active: "#e0e0e0",
                    button_background_hover: "#f0f0f0",
                    bookmark_text: "rgba(0, 0, 0, 0.8)",
                    icons: "rgba(0, 0, 0, 0.8)",
                    ntp_background: "#ffffff",
                    ntp_text: "rgba(0, 0, 0, 0.8)",
                    popup: "#ffffff",
                    popup_border: "#d0d0d0",
                    popup_highlight: "#e0e0e0",
                    popup_highlight_text: "black",
                    popup_text: "rgba(0, 0, 0, 0.8)",
                    sidebar: "#ffffff",
                    sidebar_border: "#d0d0d0",
                    sidebar_highlight: "#e0e0e0",
                    sidebar_highlight_text: "black",
                    sidebar_text: "rgba(0, 0, 0, 0.8)",
                    tab_background_separator: "transparent",
                    tab_background_text: "#000000",
                    tab_loading: "black",
                    tab_line: "rgba(0, 0, 0, 0.1)",
                    tab_text: "#000000",
                    toolbar: "rgba(248, 248, 248, 0.9)",
                    toolbar_bottom_separator: "#e0e0e0",
                    toolbar_field: "#ffffff",
                    toolbar_field_border: "transparent",
                    toolbar_field_border_focus: "#d0d0d0",
                    toolbar_field_focus: "#fafafa",
                    toolbar_field_highlight: "#e0e0e0",
                    toolbar_field_highlight_text: "black",
                    toolbar_field_separator: "#e0e0e0",
                    toolbar_field_text: "rgba(0, 0, 0, 0.8)",
                    toolbar_field_text_focus: "black",
                    toolbar_top_separator: "rgba(248, 248, 248, 0.0)",
                    toolbar_vertical_separator: "rgba(0, 0, 0, 0.1)"
                }
            };
        }
    }

    // Create a version for the opposite theme mode
    createForMode(isDarkMode) {
        const newTheme = new BasicColorTheme(this.frame, isDarkMode);
        newTheme.usage = this.usage;
        newTheme.lastUsed = this.lastUsed;
        return newTheme;
    }
}

let themeOfWindowID = new Map();
let currentThemeMode = null;

const LIGHT_THEME_COLORS = [
    '#B8103D',
    '#7A21C7',
    '#D6691A',
    '#1B5A96',
    '#8F0202',
    '#0A7A0A',
    '#2C1B47',
    '#B8226F',
    '#4A00B8',
    '#8B4513',
    '#2F4F4F',
    '#483D8B',
    '#8B008B',
    '#556B2F',
    '#8B4789',
];

const DARK_THEME_COLORS = [
    '#FF4081',
    '#E040FB',
    '#FF9800',
    '#2196F3',
    '#F44336',
    '#4CAF50',
    '#9C27B0',
    '#FF5722',
    '#3F51B5',
    '#FF6F00',
    '#E91E63',
    '#009688',
    '#795548',
    '#607D8B',
    '#FFEB3B',
];

let LIGHT_THEMES = [];
let DARK_THEMES = [];

function initializeThemes() {
    LIGHT_THEMES = LIGHT_THEME_COLORS.map(color => new BasicColorTheme(color, false));
    DARK_THEMES = DARK_THEME_COLORS.map(color => new BasicColorTheme(color, true));
}

function getCurrentThemes() {
    return currentThemeMode === 'dark' ? DARK_THEMES : LIGHT_THEMES;
}

function getNextTheme() {
    const currentThemes = getCurrentThemes();
    const sortedThemes = [...currentThemes];
    sortedThemes.sort((a, b) => {
        if (a.usage === b.usage) {
            return a.lastUsed - b.lastUsed; // Fixed comparison logic
        }
        return a.usage - b.usage;
    });
    return sortedThemes[0];
}

function applyThemeToWindow(window) {
    const newTheme = getNextTheme();
    browser.theme.update(window.id, newTheme.browserThemeObject);

    newTheme.usage += 1;
    newTheme.lastUsed = Date.now();
    themeOfWindowID.set(window.id, newTheme);
}

async function applyThemeToAllWindows() {
    for (const window of await browser.windows.getAll()) {
        applyThemeToWindow(window);
    }
}

function freeThemeOfDestroyedWindow(window_id) {
    const theme = themeOfWindowID.get(window_id);
    if (theme) {
        theme.usage -= 1;
        themeOfWindowID.delete(window_id);
    }
}

// Detect Firefox theme mode
async function detectThemeMode() {
    try {
        console.debug('Starting theme detection...');

        // Method 1: Check stored preference from previous session first
        const stored = await browser.storage.local.get('detectedThemeMode');
        if (stored.detectedThemeMode) {
            currentThemeMode = stored.detectedThemeMode;
            console.debug(`Using stored theme mode: ${currentThemeMode}`);
            return;
        }

        // Method 2: Try to detect from OS through content script injection
        try {
            const tabs = await browser.tabs.query({ active: false });

            const suitableTab = tabs.find(tab =>
                tab.url &&
                tab.url.startsWith('http') &&
                !tab.url.includes('moz-extension:') &&
                !tab.url.includes('about:')
            );

            if (suitableTab) {
                console.debug('Attempting to inject detection script into:', tabs[0].url);
                const results = await browser.tabs.executeScript(tabs[0].id, {
                    code: `
                        try {
                            const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
                            console.log('OS theme preference:', isDark ? 'dark' : 'light');
                            isDark ? "dark" : "light";
                        } catch(e) {
                            console.error('Detection error:', e);
                            "light";
                        }
                    `
                });

                if (results && results[0]) {
                    currentThemeMode = results[0];
                    console.debug(`Detected theme mode: ${currentThemeMode} (from OS preference)`);
                    // Store this detection for future sessions
                    await browser.storage.local.set({ detectedThemeMode: currentThemeMode });
                    return;
                }
            } else {
                console.debug('No suitable tabs found for script injection');
            }
        } catch (scriptError) {
            console.debug('Could not inject detection script:', scriptError);
        }

        // Method 3: Get Firefox's current theme info (this often returns null for default themes)
        const themeInfo = await browser.theme.getCurrent();
        console.debug('Firefox theme info:', themeInfo);

        if (themeInfo && themeInfo.colors && themeInfo.colors.toolbar) {
            const toolbarColor = themeInfo.colors.toolbar;
            console.debug('Found toolbar color:', toolbarColor);

            const rgb = hexToRgb(toolbarColor);
            if (rgb) {
                const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
                currentThemeMode = luminance < 0.5 ? 'dark' : 'light';
                console.debug(`Detected theme mode: ${currentThemeMode} (from Firefox theme, luminance: ${luminance})`);
                await browser.storage.local.set({ detectedThemeMode: currentThemeMode });
                return;
            }
        }

        // Method 4: Check Firefox's built-in theme preference
        try {
            console.debug('Trying alternative Firefox theme detection...');

            // Firefox stores its theme preference, but we need to access it differently
            // We'll create a small popup to check the computed styles
            const windows = await browser.windows.getAll();
            if (windows.length > 0) {
                // Try to infer from browser's native styling by checking window info
                console.debug('Checking window properties for theme hints...');

                // This is a heuristic: if Firefox is in dark mode, 
                // the default new tab page usually reflects this
                const newTabResult = await createDetectionTab();
                if (newTabResult) {
                    currentThemeMode = newTabResult;
                    console.debug(`Detected theme mode: ${currentThemeMode} (from detection tab)`);
                    await browser.storage.local.set({ detectedThemeMode: currentThemeMode });
                    return;
                }
            }
        } catch (altError) {
            console.debug('Alternative detection failed:', altError);
        }

        // Method 5: Ultimate fallback - check time of day as a heuristic
        const hour = new Date().getHours();
        currentThemeMode = (hour >= 20 || hour <= 6) ? 'dark' : 'light';
        console.debug(`Using time-based fallback: ${currentThemeMode} (${hour}:00)`);

    } catch (error) {
        console.debug('Could not detect theme mode, using light as final fallback:', error);
        currentThemeMode = 'light';
    }
}

// Helper function to create a detection tab safely
async function createDetectionTab() {
    try {
        // Create a new tab with about:blank (always allowed)
        const tab = await browser.tabs.create({
            url: 'about:blank',
            active: false
        });

        // Wait a moment for it to load
        await new Promise(resolve => setTimeout(resolve, 200));

        // Try to inject our detection script
        const results = await browser.tabs.executeScript(tab.id, {
            code: `
                try {
                    // Check the actual computed style of the page
                    const body = document.body;
                    const computedStyle = window.getComputedStyle(body);
                    const bgColor = computedStyle.backgroundColor;
                    
                    // Also check prefers-color-scheme
                    const prefersColorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
                    
                    console.log('Body background:', bgColor, 'Prefers dark:', prefersColorScheme);
                    
                    // Return OS preference
                    prefersColorScheme ? "dark" : "light";
                } catch(e) {
                    console.error('Detection tab error:', e);
                    null;
                }
            `
        });

        // Clean up the tab
        await browser.tabs.remove(tab.id);

        return results && results[0] ? results[0] : null;

    } catch (error) {
        console.debug('Detection tab creation failed:', error);
        return null;
    }
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Handle theme changes when Firefox theme switches
browser.theme.onUpdated.addListener(async (updateInfo) => {
    // Only react to theme changes that aren't from our extension
    if (updateInfo.windowId === undefined) {
        // This is a global theme change (like switching to dark mode)
        await detectThemeMode();

        // Re-apply themes to all windows with the new mode
        for (const [windowId, oldTheme] of themeOfWindowID.entries()) {
            const newTheme = getCurrentThemes().find(theme => theme.frame === oldTheme.frame);
            if (newTheme) {
                // Transfer usage stats
                newTheme.usage = oldTheme.usage;
                newTheme.lastUsed = oldTheme.lastUsed;

                // Apply the theme for the new mode
                browser.theme.update(windowId, newTheme.browserThemeObject);
                themeOfWindowID.set(windowId, newTheme);
            }
        }
    }
});

// Initialize extension
async function initialize() {
    await detectThemeMode();
    initializeThemes();
    await applyThemeToAllWindows();
}

// Event listeners
browser.windows.onCreated.addListener(applyThemeToWindow);
browser.windows.onRemoved.addListener(freeThemeOfDestroyedWindow);
browser.runtime.onStartup.addListener(initialize);
browser.runtime.onInstalled.addListener(initialize);
