"""Check the Firefox extension manifest and committed release package."""

import json
from pathlib import Path
import struct
import sys
from zipfile import BadZipFile, ZipFile

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "extension" / "code"
XPI = SOURCE / "ZoneBourse_DLB_1-0-0.xpi"


def check(condition, message):
    if not condition:
        raise ValueError(message)


def validate():
    manifest = json.loads((SOURCE / "manifest.json").read_text(encoding="utf-8"))
    check(manifest.get("manifest_version") == 2, "Expected Firefox Manifest V2")
    check(manifest.get("version") == "1.0", "Expected package version 1.0")
    check(manifest.get("browser_specific_settings", {}).get("gecko", {}).get("id"), "Missing Firefox extension ID")
    check(manifest.get("content_scripts"), "No content scripts configured")
    for entry in manifest["content_scripts"]:
        check(entry.get("matches"), "Content script has no URL matches")
        for script in entry.get("js", []):
            check((SOURCE / script).is_file(), f"Missing script: {script}")
    for size, filename in manifest.get("icons", {}).items():
        path = SOURCE / filename
        check(path.is_file(), f"Missing icon: {filename}")
        data = path.read_bytes()
        check(data.startswith(b"\x89PNG\r\n\x1a\n"), f"Invalid PNG: {filename}")
        check(struct.unpack(">II", data[16:24]) == (int(size), int(size)), f"Wrong icon dimensions: {filename}")

    check(XPI.is_file(), f"Missing package: {XPI.name}")
    try:
        with ZipFile(XPI) as archive:
            check(archive.testzip() is None, "Corrupt XPI archive")
            names = set(archive.namelist())
            check("manifest.json" in names, "XPI missing root manifest.json")
            package_manifest = json.loads(archive.read("manifest.json"))
            check(package_manifest.get("version") == manifest["version"], "XPI manifest version differs from source")
            check(package_manifest.get("name") == manifest["name"], "XPI manifest name differs from source")
            for entry in manifest["content_scripts"]:
                for script in entry.get("js", []):
                    check(script in names, f"XPI missing script: {script}")
                    check(archive.read(script) == (SOURCE / script).read_bytes(), f"XPI contains outdated script: {script}")
            for filename in manifest.get("icons", {}).values():
                check(filename in names, f"XPI missing icon: {filename}")
    except BadZipFile as error:
        raise ValueError(f"XPI is not a valid ZIP archive: {error}") from error
    print("Manifest, icons, source scripts, and release XPI passed validation.")


if __name__ == "__main__":
    try:
        validate()
    except (ValueError, OSError, KeyError, json.JSONDecodeError) as error:
        print(f"Extension check failed: {error}", file=sys.stderr)
        sys.exit(1)
