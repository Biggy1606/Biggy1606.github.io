document.addEventListener("DOMContentLoaded", initKrokiUI);

// Variables for diagram data
let generatedBlob = null;
let generatedFilename = "diagram";
let lastDiagramUrl = null;

function initKrokiUI() {
  // Initialize output format dropdown based on selected diagram type
  document
    .getElementById("diagram-type")
    .addEventListener("change", updateOutputFormats);

  // Initialize download button
  document
    .getElementById("download-btn")
    .addEventListener("click", downloadDiagram);

  // Initialize copy URL button
  document
    .getElementById("copy-url-btn")
    .addEventListener("click", copyDiagramUrl);

  // Initialize generate button
  document
    .getElementById("generate-btn")
    .addEventListener("click", generateDiagram);

  // Set initial output formats
  updateOutputFormats();

  // Hide result elements initially
  document.getElementById("result-container").style.display = "none";
  document.getElementById("error-message").style.display = "none";
  document.getElementById("loading").style.display = "none";
  document.getElementById("download-btn").style.display = "none";
}

// Text encoding function with fallback
function textEncode(str) {
  if (window.TextEncoder) {
    return new TextEncoder("utf-8").encode(str);
  }
  var utf8 = unescape(encodeURIComponent(str));
  var result = new Uint8Array(utf8.length);
  for (var i = 0; i < utf8.length; i++) {
    result[i] = utf8.charCodeAt(i);
  }
  return result;
}

// Compress and encode diagram source
function compressDiagramSource(source) {
  if (!window.pako) {
    showError("Pako compression library not loaded. Please refresh the page.");
    return null;
  }

  try {
    const data = textEncode(source);
    const compressed = pako.deflate(data, { level: 9, to: "string" });
    return btoa(compressed).replace(/\+/g, "-").replace(/\//g, "_");
  } catch (error) {
    showError("Failed to compress diagram source: " + error.message);
    return null;
  }
}

// Map of diagram types to their supported output formats
const supportedFormats = {
  actdiag: ["png", "svg", "pdf"],
  blockdiag: ["png", "svg", "pdf"],
  bpmn: ["svg"],
  bytefield: ["svg"],
  c4plantuml: ["png", "svg", "pdf", "txt", "base64"],
  d2: ["svg"],
  dbml: ["svg"],
  ditaa: ["png", "svg"],
  erd: ["png", "svg", "jpeg", "pdf"],
  excalidraw: ["svg"],
  graphviz: ["png", "svg", "jpeg", "pdf"],
  mermaid: ["png", "svg"],
  nomnoml: ["svg"],
  nwdiag: ["png", "svg", "pdf"],
  packetdiag: ["png", "svg", "pdf"],
  pikchr: ["svg"],
  plantuml: ["png", "svg", "pdf", "txt", "base64"],
  rackdiag: ["png", "svg", "pdf"],
  seqdiag: ["png", "svg", "pdf"],
  structurizr: ["png", "svg", "pdf", "txt", "base64"],
  svgbob: ["svg"],
  symbolator: ["svg"],
  tikz: ["png", "svg", "jpeg", "pdf"],
  umlet: ["png", "svg", "jpeg"],
  vega: ["png", "svg", "pdf"],
  vegalite: ["png", "svg", "pdf"],
  wavedrom: ["svg"],
  wireviz: ["png", "svg"],
};

// Update output format options based on selected diagram type
function updateOutputFormats() {
  const diagramType = document.getElementById("diagram-type").value;
  const outputFormat = document.getElementById("output-format");
  const formats = supportedFormats[diagramType] || ["svg"];

  // Clear existing options
  outputFormat.innerHTML = "";

  // Add supported formats
  formats.forEach((format) => {
    const option = document.createElement("option");
    option.value = format;
    option.textContent = format.toUpperCase();
    outputFormat.appendChild(option);
  });
}

// Show error message
function showError(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  document.getElementById("loading").style.display = "none";
}

// Validate server URL
function validateServerUrl(url) {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch (e) {
    return false;
  }
}

// Generate diagram
async function generateDiagram() {
  const serverUrl = document.getElementById("server").value.trim();
  const diagramType = document.getElementById("diagram-type").value;
  const outputFormat = document.getElementById("output-format").value;
  const diagramSource = document.getElementById("diagram-source").value;

  const resultContainer = document.getElementById("result-container");
  const errorMessage = document.getElementById("error-message");
  const loading = document.getElementById("loading");
  const downloadBtn = document.getElementById("download-btn");
  const copyUrlBtn = document.getElementById("copy-url-btn");

  // Validate server URL
  if (!validateServerUrl(serverUrl)) {
    showError("Please enter a valid HTTP or HTTPS URL for the Kroki server");
    return;
  }

  // Clear previous results
  resultContainer.style.display = "none";
  resultContainer.innerHTML = "";
  errorMessage.style.display = "none";
  errorMessage.textContent = "";
  loading.style.display = "block";
  downloadBtn.style.display = "none";
  copyUrlBtn.style.display = "none";

  try {
    // Create request URL
    const url = `${serverUrl}/${diagramType}/${outputFormat}`;

    // Create request payload
    const payload = {
      diagram_source: diagramSource,
    };

    // Set up request timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    // Send POST request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: `image/${
          outputFormat === "pdf"
            ? "pdf"
            : outputFormat === "txt" || outputFormat === "base64"
            ? "plain"
            : outputFormat
        }`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `Server responded with error: ${response.status} ${response.statusText}`
      );
    }

    // Get response as blob
    const blob = await response.blob();

    // Save for download
    generatedBlob = blob;
    generatedFilename = `diagram-${diagramType}-${new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/:/g, "-")}`;

    // Create direct URL for diagram
    const encodedSource = compressDiagramSource(diagramSource);
    if (encodedSource) {
      lastDiagramUrl = `${serverUrl}/${diagramType}/${outputFormat}/${encodedSource}`;
      copyUrlBtn.style.display = "inline-block";
    }

    // Create object URL
    const objectUrl = URL.createObjectURL(blob);

    // Display result
    if (outputFormat === "txt" || outputFormat === "base64") {
      // For text output, create a pre element instead of using an image
      const pre = document.createElement("pre");
      const text = await blob.text();
      pre.textContent = text;
      pre.style.backgroundColor = "white";
      pre.style.color = "black";
      pre.style.padding = "1rem";
      pre.style.borderRadius = "5px";
      pre.style.overflow = "auto";
      pre.style.maxHeight = "500px";
      pre.style.textAlign = "left";
      pre.style.whiteSpace = "pre-wrap";

      resultContainer.appendChild(pre);
    } else {
      // For image outputs, use the image element
      const img = document.createElement("img");
      img.src = objectUrl;
      img.alt = "Generated Diagram";
      img.className = "result-image";
      resultContainer.appendChild(img);
    }

    resultContainer.style.display = "block";
    downloadBtn.style.display = "inline-block";
  } catch (error) {
    if (error.name === "AbortError") {
      showError(
        "Request timed out. Please check your server URL and try again."
      );
    } else {
      showError(`Error generating diagram: ${error.message}`);
    }
  } finally {
    loading.style.display = "none";
  }
}

function downloadDiagram() {
  if (!generatedBlob) {
    showError(
      "No diagram available for download. Please generate a diagram first."
    );
    return;
  }

  const outputFormat = document.getElementById("output-format").value;

  // Create a download link
  const link = document.createElement("a");
  link.href = URL.createObjectURL(generatedBlob);
  link.download = `${generatedFilename}.${outputFormat}`;

  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the object URL to avoid memory leaks
  URL.revokeObjectURL(link.href);
}

// Copy diagram URL to clipboard
function copyDiagramUrl() {
  if (!lastDiagramUrl) {
    showError("No diagram URL available. Please generate a diagram first.");
    return;
  }

  // Use the clipboard API if available
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(lastDiagramUrl)
      .then(() => {
        const copyBtn = document.getElementById("copy-url-btn");
        const originalText = copyBtn.textContent;

        // Provide user feedback
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      })
      .catch((err) => {
        showError("Failed to copy URL: " + err.message);
      });
  } else {
    // Fallback for browsers without clipboard API
    const textarea = document.createElement("textarea");
    textarea.value = lastDiagramUrl;
    textarea.style.position = "fixed"; // Avoid scrolling to bottom
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        const copyBtn = document.getElementById("copy-url-btn");
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      } else {
        showError("Failed to copy URL");
      }
    } catch (err) {
      showError("Failed to copy URL: " + err.message);
    }

    document.body.removeChild(textarea);
  }
}
