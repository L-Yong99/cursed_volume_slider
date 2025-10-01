let currentVolume = 50;

// DOM elements
const volumeValue = document.getElementById('volume-value');
const volumeFill = document.getElementById('volume-fill');
const volumeThumb = document.getElementById('volume-thumb');
const volumeBar = document.getElementById('volume-bar');
const shootButton = document.getElementById('shoot-goose');
const gooseLayer = document.getElementById('goose-layer');
const gooseFrames = [
  'Geese_fly_1.png',
  'Geese_fly_2.png',
  'Geese_fly_3.png',
  'Geese_fly_4.png',
  'Geese_fly_5.png'
];

// FUNCTIONS ###################################################################################

// Update volume UI
function updateVolumeDisplay() {
  volumeValue.textContent = currentVolume;
  volumeFill.style.width = `${currentVolume}%`;
  volumeThumb.style.left = `${currentVolume}%`;
}

// Spawn goose on flight path
function spawnGoose() {
  const goose = document.createElement('div');
  goose.classList.add('goose');

  const modifier = Math.floor(Math.random() * 5) - 2;
  goose.textContent = modifier > 0 ? `+${modifier}` : `${modifier}`;

  // Random horizontal start position
  goose.style.left = `${Math.random() * window.innerWidth}px`;

  // Random animation durations
  const flyDuration = (2 + Math.random() * 2).toFixed(2);    // 2–4s
  const launchDuration = (3 + Math.random() * 3).toFixed(2); // 3–6s

  goose.style.animation = `fly ${flyDuration}s linear forwards, launch ${launchDuration}s linear forwards`;

  goose.addEventListener('click', () => {
      currentVolume = Math.max(0, Math.min(100, currentVolume + modifier));
      updateVolumeDisplay();

      const honk = new Audio('honk.mp3');
      honk.play();

      // Get current position and switch to top-based layout
      const rect = goose.getBoundingClientRect();
      goose.style.top = `${rect.top}px`;
      goose.style.left = `${rect.left}px`;
      goose.style.bottom = 'auto';
      goose.style.position = 'fixed';

      // Cancel current animation
      goose.style.animation = 'none';
      void goose.offsetWidth; // force reflow
      
      clearInterval(goose.dataset.animationInterval);
      goose.style.backgroundImage = `url('Geese_ded_1.png')`;

      // Apply fall animation
      
      setTimeout(() => {
        goose.style.backgroundImage = `url('Geese_fall_1.png')`;
        goose.style.animation = `fall 1s ease-in forwards`;
      }, 1000); // wait 2 seconds before falling


      setTimeout(() => {
        goose.remove();
      }, 3000); // match fallOff duration
    });


  gooseLayer.appendChild(goose);
  animateGoose(goose);
};

// goose flying animation
function animateGoose(gooseElement) {
  let frame = 0;
  const totalFrames = gooseFrames.length;
  const interval = setInterval(() => {
    gooseElement.style.backgroundImage = `url('${gooseFrames[frame]}')`;
    frame = (frame + 1) % totalFrames;
  }, 140);

  // Store interval ID on the element itself
  gooseElement.dataset.animationInterval = interval;
};


// EVENTS ###############################################################################

// Click on volume bar to set volume
// volumeBar.addEventListener('click', (e) => {
//   const rect = volumeBar.getBoundingClientRect();
//   const x = e.clientX - rect.left;
//   const percent = Math.round((x / rect.width) * 100);
//   currentVolume = Math.max(0, Math.min(100, percent));
//   updateVolumeDisplay();
// });


// Shoot Goose button
shootButton.addEventListener('click', () => {
  const gooseCount = Math.floor(Math.random() * 11) + 5; // 5 to 15
  for (let i = 0; i < gooseCount; i++) {
    spawnGoose();
  }
});

// // Spawn a goose every 2 seconds
// setInterval(spawnGoose, 2000);

// Initial render
updateVolumeDisplay();