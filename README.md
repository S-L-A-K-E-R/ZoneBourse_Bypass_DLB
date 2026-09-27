# ZoneBourse — Daily Limit Bypass

A small, unofficial **Firefox extension** that removes certain pop-up overlays on [ZoneBourse](https://www.zonebourse.com/) and restores page scrolling.

This is a lightweight personal project. The source code and a packaged `.xpi` are available in this repository.

## What it does

- Removes targeted modal pop-ups and background overlays.
- Restores scrolling when an overlay has locked the page.
- Watches for overlays added after the page loads.

The extension runs on `zonebourse.com` pages. It only changes elements in your browser; it does not provide access to content your account is not authorized to view.

## Project files

| File | Description |
| --- | --- |
| [`manifest.json`](extension/code/manifest.json) | Firefox extension configuration. |
| [`extension_content.js`](extension/code/extension_content.js) | Content script that handles overlays and scrolling. |
| [`ZoneBourse_DLB_1-0-0.xpi`](extension/code/ZoneBourse_DLB_1-0-0.xpi) | Packaged extension (v1.0). |

## Getting started

You can browse the source code above or download the packaged `.xpi`. To install a local add-on, open Firefox's **Add-ons and themes** manager and select **Install Add-on From File**. Firefox may require the package to be signed.

## Disclaimer

This is an independent project and is **not affiliated with ZoneBourse**. It may stop working if the website changes. Use it in accordance with the site's terms and your access rights.
