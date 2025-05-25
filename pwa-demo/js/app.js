// PWA Demo Application
document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");
  if (!app) return;

  const header = document.createElement("header");
  const main = document.createElement("main");

// Title
  const title = document.createElement("h1");
  title.textContent = "Welcome to the PWA Demo";
  header.appendChild(title);

  // Create network status element first
  const networkStatus = document.createElement("div");
  networkStatus.id = "network-status";
  main.appendChild(networkStatus);

  // Display current date
  const today = new Date();
  const dateElement = document.createElement("p");
  dateElement.textContent = `Today is ${today.toLocaleDateString()}`;
  main.appendChild(dateElement);

  // Add install button
  const installButton = document.createElement("button");
  installButton.style.display = "none";
  installButton.textContent = "Install App";
  installButton.classList.add("accent");
  installButton.addEventListener("click", installApp);
  main.appendChild(installButton);

  // Add footer
  const footer = document.createElement("footer");
  footer.innerHTML = `Stylized with <a href="http://matcha.mizu.sh/">Matcha</a>`;

  // Append elements to the app
  app.appendChild(header);
  app.appendChild(main);
  app.appendChild(footer);

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

// Listen for messages from service worker
navigator.serviceWorker.addEventListener("message", (event) => {
  if (event.data.type === "NEW_CONTENT_AVAILABLE") {
    showRefreshUI();
  }
});

// Function to show refresh UI
function showRefreshUI() {
  const refreshBanner = document.createElement("div");
  refreshBanner.id = "refresh-banner";
  refreshBanner.classList.add("flash");
  refreshBanner.classList.add("attention");
  refreshBanner.innerHTML = `
    <p>New content is available!</p>
    <button id="refresh-button">Refresh page</button>
  `;

  document.body.appendChild(refreshBanner);

  document.getElementById("refresh-button").addEventListener("click", () => {
    window.location.reload();
  });
}

// Register beforeinstallprompt for Add to Home Screen
let deferredPrompt;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Show the install button
  const installButton = document.getElementById("install-button");
  if (installButton) {
    installButton.style.display = "block";
  }

  console.log("PWA install prompt available");
});

// Function to handle app installation
function installApp() {
  if (!deferredPrompt) {
    // The deferred prompt isn't available
    alert(
      "Installation is not available at this time. You may already have installed the app or your browser doesn't support installation."
    );
    return;
  }

  // Show the installation prompt
  deferredPrompt.prompt();

  // Wait for the user to respond to the prompt
  deferredPrompt.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === "accepted") {
      console.log("User accepted the install prompt");
      // Hide the install button after installation
      const installButton = document.getElementById("install-button");
      if (installButton) {
        installButton.style.display = "none";
      }
    } else {
      console.log("User dismissed the install prompt");
    }

    // Clear the deferred prompt variable
    deferredPrompt = null;
  });
}

// Hide install button if app is already installed
window.addEventListener("appinstalled", (evt) => {
  console.log("App was installed");
  const installButton = document.getElementById("install-button");
  if (installButton) {
    installButton.style.display = "none";
  }
});
