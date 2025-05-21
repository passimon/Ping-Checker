// Store ping values and counter
let pingData = [];
let counter = 0; // Numerical order for measurements
let measuring = true; // Flag to track if measurement is active
let currentInterval = 5000; // Default interval (5 seconds)
let measurementInterval; // Will hold the setInterval reference

// Function to start measurements
function startMeasurement() {
  if (measurementInterval) {
    clearInterval(measurementInterval);
  }
  measurementInterval = setInterval(() => {
    getPingValue().then((pingValue) => {
      counter++;
      pingData.push({ x: counter, y: pingValue });
      if (pingData.length > 6) {
        pingData.shift();
      }
      // Update the extension badge with the current ping value
      chrome.action.setBadgeText({ text: `${pingValue}` });
      // Send the updated ping data to any listening popup
      chrome.runtime.sendMessage({ action: 'updatePingData', data: pingData }, (response) => {
        if (chrome.runtime.lastError) {
          // Logging the error for debugging purposes
          console.warn('Message not delivered:', chrome.runtime.lastError.message);
        } 
      });
    }).catch((error) => {
      console.error('Error updating ping value:', error);
      chrome.action.setBadgeText({ text: 'ERR' });
    });
  }, currentInterval);
}

// Function to stop measurements
function stopMeasurement() {
  if (measurementInterval) {
    clearInterval(measurementInterval);
    measurementInterval = null;
  }
}

// Initialize measurement on load
startMeasurement();

// Function to get the ping value
async function getPingValue() {
  const pingStart = new Date().getTime();
  try {
    // Use no-cors: if no error is thrown, we trust the request succeeded.
    await fetch('https://google.com', { method: 'GET', mode: 'no-cors' });
    // Calculate the elapsed time as the ping value
    const pingValue = new Date().getTime() - pingStart;
    return pingValue;
  } catch (error) {
    throw new Error('Failed to get ping value');
  }
}

// Listen for messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPingValue') {
    getPingValue().then((pingValue) => {
      sendResponse({ pingValue });
    }).catch((error) => {
      sendResponse({ error: 'Failed to get ping value' });
    });
    return true; // Indicate asynchronous sendResponse
  } else if (request.action === 'refreshGraph') {
    // Reset the ping data and counter
    pingData = [];
    counter = 0;
    // Notify the popup to refresh the graph (clear the data)
    chrome.runtime.sendMessage({ action: 'updatePingData', data: pingData }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn('Message not delivered:', chrome.runtime.lastError.message);
      }
    });
  } else if (request.action === 'updateInterval') {
    // Update the interval duration (convert seconds to milliseconds)
    currentInterval = request.interval * 1000;
    if (measuring) {
      // Restart measurement with the new interval
      startMeasurement();
    }
  } else if (request.action === 'toggleMeasurement') {
    measuring = !measuring;
    if (measuring) {
      startMeasurement();
    } else {
      stopMeasurement();
      // Optionally update the badge to show paused state
      chrome.action.setBadgeText({ text: 'II' });
    }
    // Reply to the sender with the current measuring state
    sendResponse({ measuring });
  }
});
