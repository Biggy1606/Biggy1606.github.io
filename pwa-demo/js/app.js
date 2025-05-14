// PWA Demo Application
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (!app) return;

  // Create network status element first
  const networkStatus = document.createElement("div");
  networkStatus.id = "network-status";
  app.appendChild(networkStatus);

  // Display current date
  const today = new Date();
  const dateElement = document.createElement("p");
  dateElement.textContent = `Today is ${today.toLocaleDateString()}`;
  app.appendChild(dateElement);

  // Initial network status update
  updateNetworkStatus();

  // Listen for network changes
  window.addEventListener("online", () => {
    updateNetworkStatus();
    updateCache(); // Update cache when coming online
  });
  window.addEventListener("offline", updateNetworkStatus);

  // Initial cache update if online
  if (navigator.onLine) {
    updateCache();
  }
});

function updateNetworkStatus() {
  const statusElement = document.getElementById("network-status");
  if (!statusElement) return;

  if (navigator.onLine) {
    statusElement.textContent = "You are online";
    statusElement.style.color = "green";
  } else {
    statusElement.textContent = "You are offline - using cached content";
    statusElement.style.color = "red";
  }
}

// Function to update cache when online
function updateCache() {
  if (!navigator.onLine) return; // Skip cache update if offline

  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    // Send message to service worker to update cache
    navigator.serviceWorker.controller.postMessage("updateCache");
    console.log("Cache update requested 🔃");
  }
}

// Register beforeinstallprompt for Add to Home Screen
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log("PWA install prompt available");
});
