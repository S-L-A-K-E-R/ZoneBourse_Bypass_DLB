# ZoneBourse — Daily Limit Bypass (DLB)

[![Firefox extension CI](https://github.com/S-L-A-K-E-R/ZoneBourse_Bypass_DLB/actions/workflows/firefox-extension.yml/badge.svg)](https://github.com/S-L-A-K-E-R/ZoneBourse_Bypass_DLB/actions/workflows/firefox-extension.yml)

A lightweight **Firefox extension available on the official [Firefox Add-ons store](https://addons.mozilla.org/fr/firefox/addon/zonebourse-dlb/)**. It removes blocking pop-up overlays on [ZoneBourse](https://www.zonebourse.com/) and restores page scrolling for a smoother browsing experience.

[**Install ZoneBourse DLB on Firefox Add-ons**](https://addons.mozilla.org/fr/firefox/addon/zonebourse-dlb/)

## Features

- **Automatic pop-up removal:** detects and removes targeted blocking overlays.
- **Scroll restoration:** unlocks scrolling when an overlay has locked the page.
- **Works in the background:** watches for overlays that appear after a page loads.
- **Lightweight:** runs only on ZoneBourse pages, with no configuration required.

## Source code

| File | Description |
| --- | --- |
| [`manifest.json`](extension/code/manifest.json) | Firefox extension configuration. |
| [`extension_content.js`](extension/code/extension_content.js) | Content script for overlay removal and scroll restoration. |
| [`ZoneBourse_DLB_1-0-0.xpi`](extension/code/ZoneBourse_DLB_1-0-0.xpi) | Packaged version 1.0, kept here for reference. |

**Recommended installation:** use the [official Firefox Add-ons listing](https://addons.mozilla.org/fr/firefox/addon/zonebourse-dlb/) to install the extension.

## Development checks

GitHub Actions checks JavaScript syntax, runs overlay-handling smoke tests, validates the extension manifest and packaged `.xpi`, and runs Mozilla's `web-ext` linter. The packaged v1.0 file is preserved as a historical release; CI warns if it differs from the current source. These automated checks do not replace testing against the live website.

See [the workflow](.github/workflows/firefox-extension.yml) and [v1.0.0 release](https://github.com/S-L-A-K-E-R/ZoneBourse_Bypass_DLB/releases/tag/v1.0.0).

## Disclaimer

ZoneBourse DLB is an independent project published on Firefox Add-ons; it is **not affiliated with or endorsed by ZoneBourse**. It modifies page elements in your browser and does not grant access to server-restricted or subscription-only content. Website updates may affect its functionality.
