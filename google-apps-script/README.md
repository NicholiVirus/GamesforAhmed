# Torah Runner on Google Apps Script

The whole game in three files you can paste into script.google.com.

1. Go to https://script.google.com and click **New project**.
2. Replace the contents of `Code.gs` with this folder's `Code.gs`.
3. Click **+** next to Files, choose **HTML**, name it `Index` (no `.html`), and paste this folder's `Index.html`.
4. Optional: Project Settings, tick "Show appsscript.json", and paste this folder's `appsscript.json`.
5. Click **Deploy > New deployment**, pick type **Web app**, set "Who has access" to **Anyone**, and click **Deploy**.
6. Open the web app URL. Bookmark or share it.

Notes
- `Index.html` is built from `torah-runner/` (all game code bundled into one file). Rebuild it after changing the game.
- Progress (manna, words, high scores) is saved in the browser, per device.
- The shared "Everyone" high-score board only exists on the claude.ai page; the Apps Script version shows this device's top 10.
- The 3D engine (three.js) loads from cdn.jsdelivr.net, so the device needs internet access to that site.
