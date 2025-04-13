// Sound effects for pet interactions
const sounds = {
  feed: new Audio('/sounds/eat.mp3'),
  play: new Audio('/sounds/play.mp3'),
  sleep: new Audio('/sounds/sleep.mp3'),
  pet: new Audio('/sounds/pet.mp3'),
  levelUp: new Audio('/sounds/level-up.mp3'),
  error: new Audio('/sounds/error.mp3')
};

// Initialize all sounds with lower volume
Object.values(sounds).forEach(sound => {
  sound.volume = 0.3;
});

export const playSound = (action) => {
  const sound = sounds[action];
  if (sound) {
    sound.currentTime = 0; // Reset sound to start
    sound.play().catch(err => console.log('Error playing sound:', err));
  }
};

export default sounds;
