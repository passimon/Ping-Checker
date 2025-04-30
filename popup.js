document.addEventListener("DOMContentLoaded", function () {
  const pingValueElement = document.getElementById("ping-value");

  // Send a message to the background script to get the ping value
  browser.runtime.sendMessage('getPingValue').then((response) => {
    if (response.error) {
      pingValueElement.textContent = response.error;
    } else {
      const pingValue = response.pingValue;
      pingValueElement.textContent = `Live Ping: ${pingValue}ms`;
    }
  });
});
