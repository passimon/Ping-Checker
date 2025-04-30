// Function to get the ping value
function getPingValue() {
  return new Promise((resolve, reject) => {
    var ping = new Date().getTime();
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://google.com', true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        var pingValue = new Date().getTime() - ping;
        resolve(pingValue);
      } else {
        reject('Failed to get ping value');
      }
    };
    xhr.onerror = function() {
      reject('Failed to get ping value');
    };
    xhr.send();
  });
}

// Update the ping value every 5 seconds
setInterval(() => {
  getPingValue().then((pingValue) => {
    browser.browserAction.setBadgeText({ text: `${pingValue}` });
  }).catch((error) => {
    console.error('Error updating ping value:', error);
    browser.browserAction.setBadgeText({ text: '...' });
  });
}, 5000);

// Listen for popup load event
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === 'getPingValue') {
    getPingValue().then((pingValue) => {
      sendResponse({ pingValue });
    }).catch((error) => {
      sendResponse({ error: 'Failed to get ping value' });
    });
    return true; // indicate that the message was handled
  }
});
