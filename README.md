gi# Appium Demo (Android ApiDemos)

[![Android Appium E2E](https://github.com/Sgtsamurai92/Appium-demo/actions/workflows/android-appium.yml/badge.svg?branch=main)](https://github.com/Sgtsamurai92/Appium-demo/actions/workflows/android-appium.yml)

A minimal WebdriverIO + Appium v2 setup to run a native Android test on the ApiDemos app.

## Demo Video

(https://github.com/Sgtsamurai92/videolink)

## Prerequisites

- Node.js 18+
- Java JDK 17 and JAVA_HOME set (required by UiAutomator2)
- Android SDK installed with platform-tools, emulator, cmdline-tools on PATH
- An Android Virtual Device (AVD) installed (e.g., `Medium_Phone_API_36.1`)

## Install

```
npm install
npx appium driver install uiautomator2
# optional: fetch the demo APK into ./apps/
npm run apk:fetch
```

## APK

Download ApiDemos APK and place it at `./apps/ApiDemos-debug.apk` or set `APK_PATH` to your file.

- Example download (choose a trusted source): https://github.com/appium/android-apidemos/releases

## Configure (optional)

You can set these env vars to control the run:

- `APK_PATH` – absolute path to your APK (defaults to `./apps/ApiDemos-debug.apk`)
- `AVD_NAME` – AVD name to auto-boot (e.g., `Medium_Phone_API_36.1`)
- `PLATFORM_VERSION` – Android version string (optional)

## Run

Start tests (Appium service will be started by WDIO):

```
# optionally pick an AVD to auto-boot
$env:AVD_NAME = "Medium_Phone_API_36.1"

npm test
```

Or separately:

```
npm run appium
npm run wdio
```

## Publish to GitHub

1. Ensure you don’t commit APK binaries (they are ignored via .gitignore).
2. Create a new repo on GitHub and push this folder:
  - `git init` → `git add .` → `git commit -m "chore: initial appium demo"`
  - `git branch -M main` → `git remote add origin <your_repo_url>` → `git push -u origin main`
3. Optionally enable CI (GitHub Actions) using the provided workflow in `.github/workflows/android-appium.yml`.

## CI on GitHub Actions (optional)

This repo includes a workflow that:
- sets up Node and Java 17,
- launches a headless Android emulator,
- downloads the ApiDemos APK,
- installs the UiAutomator2 driver, and
- runs `npm test`.

## Notes (Windows / PowerShell)

- If you run into `sdkmanager`/Java errors, ensure `JAVA_HOME` points to JDK 17 and `%JAVA_HOME%\bin` is in PATH.
- Common AVD commands:
  - List AVDs: `emulator -list-avds`
  - Start AVD: `emulator -avd <Your_AVD_Name>`
