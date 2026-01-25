# Repository Guidelines

## Project Structure & Module Organization
- `layouts/` contains Hugo templates and partials (`_default/`, `partials/`, `shortcodes/`).
- `layouts/index.html` is the home page template; `_default/` handles list, single, taxonomy, and terms pages.
- `static/` stores theme assets; `static/css/bbgames.css` is the primary stylesheet.
- `theme.toml` defines theme metadata and the minimum Hugo version.

## Build, Test, and Development Commands
This repository is a Hugo theme (not a standalone site). Run these commands from a Hugo site that uses this theme:
- `hugo server -D` — run a local dev server including drafts.
- `hugo` — build the static site into `public/` (site repo output).

## Coding Style & Naming Conventions
- Indentation: 2 spaces in HTML templates and CSS.
- Templating: Hugo Go templates with concise conditional blocks; keep partials focused.
- CSS: use existing design tokens in `:root` (e.g., `--bg`, `--accent`) and prefer class-based selectors.

## Testing Guidelines
- No automated tests are configured in this theme.
- Validate changes by running `hugo server -D` in the consuming site and checking key pages (home, list, single, taxonomy).

## Commit & Pull Request Guidelines
- Commit messages in history are short, imperative subjects (e.g., "Add bbgames theme files"). Keep to one line when possible.
- PRs should describe the visual/behavioral impact and include screenshots for layout or style changes.
- Link related issues if applicable and mention any Hugo version assumptions.

## Configuration Tips
- Ensure the consuming site uses Hugo `>= 0.116.0` (see `theme.toml`).
- If adding new assets, place them under `static/` and reference with absolute paths (e.g., `/css/bbgames.css`).
