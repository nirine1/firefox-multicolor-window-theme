# Firefox Dynamic Window Colors

A minimalist browser extension that dynamically themes each Firefox window with a unique color.  
Use it to easily differentiate between windows or simply for a more colorful browsing experience!

## Features

- **Automatic Window Coloring:**  
  Every new window gets a distinct color theme, making it easy to tell them apart at a glance.

- **Dark & Light Mode Support:**  
  The extension detects your system or Firefox theme (dark or light) and applies matching palettes.

- **Minimal Permissions:**  
  No tracking, no data collection—just colors.

- **Persistent Themes:**  
  Each window keeps its color until closed, and themes are balanced so colors are reused fairly.

## How It Works

- When a new window opens, the extension assigns it the least-used color from a curated palette.
- The extension detects your preferred theme mode (dark or light) using several methods, including OS preference and Firefox settings.
- If you switch between dark and light mode, all windows update to matching palettes automatically.

## Local Installation

1. Download or clone this repository.
2. Go to `about:debugging` in Firefox.
3. Click **"This Firefox"** > **"Load Temporary Add-on..."**.
4. Select the `manifest.json` file from this folder.

## Customization

- You can edit the color palettes in `background.js` by modifying the `LIGHT_THEME_COLORS` and `DARK_THEME_COLORS` arrays.

## Permissions

- The extension requires access to browser theme APIs and window management to apply colors.

## License

MIT License

---

*Enjoy a more colorful browsing experience with Firefox Dynamic Window Colors!*
