// Create floating particles in the background, attached to element with id "particles"
function initParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Random size between 10px and 40px
    const size = Math.random() * 30 + 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;

    // Random animation delay
    particle.style.animationDelay = `${Math.random() * 5}s`;

    // Random opacity
    particle.style.opacity = Math.random() * 0.6 + 0.1;

    particlesContainer.appendChild(particle);
  }
}

// Initialize particles when the DOM is loaded
document.addEventListener('DOMContentLoaded', initParticles);
