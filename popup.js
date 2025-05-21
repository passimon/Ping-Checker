// Get the canvas element, buttons, the range input, and its label
const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');
const refreshButton = document.getElementById('refresh-btn');
const stopButton = document.getElementById('stop-btn');
const intervalRange = document.getElementById('interval-range');
const intervalLabel = document.getElementById('interval-label');

canvas.width = 400;
canvas.height = 200;

// Create a new Chart.js chart with an explicitly defined linear x-axis
let chart = new Chart(ctx, {
  type: 'line',
  data: {
    datasets: [{
      label: 'Ping Values',
      data: [],
      backgroundColor: 'rgb(75, 192, 192)',
      tension: 1
    }]
  },
  options: {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        ticks: {
          display: false
        },
        title: {
          display: true,
          text: 'Measurements'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Ping Value (ms)'
        }
      }
    }
  }
});

// Listen for updates to the ping data and refresh the graph
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updatePingData') {
    const pingData = request.data;
    chart.data.datasets[0].data = pingData.map((point) => ({ x: point.x, y: point.y }));
    chart.update();
  }
});

// Add event listener for the refresh button
refreshButton.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'refreshGraph' });
});

// Add event listener for the stop/start button
stopButton.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'toggleMeasurement' }, (response) => {
    // Optionally update the UI based on the new measurement state.
    // The background can return a state flag (e.g., measuring: true/false)
    if (response && typeof response.measuring !== 'undefined') {
      stopButton.textContent = response.measuring ? 'Stop' : 'Start';
    }
  });
});

// Update interval label and notify background when the range input changes
intervalRange.addEventListener('input', () => {
  intervalLabel.textContent = intervalRange.value;
  // Send the new interval (converted to seconds then to milliseconds)
  chrome.runtime.sendMessage({ action: 'updateInterval', interval: Number(intervalRange.value) });
});

// On window load, send a message to set the current interval based on "interval-range" value.
window.addEventListener('load', () => {
  // Set the label according to the current value
  intervalLabel.textContent = intervalRange.value;
  chrome.runtime.sendMessage({ action: 'updateInterval', interval: Number(intervalRange.value) });
});
