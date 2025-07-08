# Ping Checker Chrome Extension

A lightweight Chrome extension that periodically measures and displays your ping (round‐trip time) to `https://google.com` right in your browser toolbar. View a live‐updating miniature chart of the last few pings in a popup and control the measurement interval, pause/resume, or clear the graph.

Chrome: https://chromewebstore.google.com/detail/ping-checker/hkibkekheimihinckebnembhcmgmfmbf
Firefox: https://addons.mozilla.org/en-GB/firefox/addon/ping-checker/

---

## Features

- Measures “ping” (round‐trip time) via a `fetch` request in a Service Worker.
- Displays the latest ping value as your extension badge.
- Popup with a live‐updating Chart.js line graph of the most recent measurements.
- Controls to pause/resume measurements and clear the graph history.
- Adjustable measurement interval (3–7 seconds by default).
- Minimal permissions: only `activeTab`.

---

## Installation

1. Clone the repo or download the source:
   ```
   git clone https://github.com/passimon/ping-checker.git
   cd ping-checker
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable Developer mode (toggle in the top‐right).
4. Click Load unpacked and select the project’s root folder.
5. The “Ping Checker” icon should appear in your toolbar.

## Usage

1. Click the “Ping Checker” icon to open the popup.  
2. Watch the chart update every _N_ seconds (default 5 sec).  
3. Use **Stop** / **Start** to pause or resume measurements.  
4. Use **Clear** to reset the chart data.  
5. Slide the **Interval** range control to change how often it pings (3–7 sec).

---

## Key Components

**background.js**  
- Uses `setInterval` to periodically `fetch('https://google.com')` in `no-cors` mode.  
- Measures time difference to approximate ping.  
- Keeps a rolling window of the last 6 values.  
- Updates the badge text and broadcasts data via `chrome.runtime.sendMessage`.  

**popup.js**  
- Renders a Chart.js line chart inside `popup.html`.  
- Listens for incoming ping-data messages to refresh the chart.  
- Sends control messages (`refreshGraph`, `toggleMeasurement`, `updateInterval`) back to `background.js`.  

**manifest.json**  
- Declares `manifest_version: 3` with a background service worker.  
- Requests only the `activeTab` permission.  

---

## Development

- Make sure you have the Chart.js library in `chart.js`. You can install it via npm and build, or download the UMD build from the official [Chart.js site](https://www.chartjs.org/).  
- After any code change, reload the extension on `chrome://extensions`.     
