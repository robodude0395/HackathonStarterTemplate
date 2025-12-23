// Custom JavaScript: This is where you add interactivity to your website

// helper functions to obtain url and handle errors
function getUrl() {
  return `http://localhost:5000/`
}

function getLeaderboard() {
  let url = `${getUrl()}players/leaderboard`

  console.log(`Leaderboard Requested From: ${url}`)

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.error(err);
    });

}


//code to return vals form buttons

const startGameBtn = document.getElementById("startGameBtn");
const playerNameInput = document.getElementById("playerName");

// This event listener waits for the entire HTML page to load before running any code
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loaded!");

  // We find the button using its unique ID from the HTML
  const ctaButton = document.getElementById("cta-button");

  // Check if the button exists on the page before adding an event listener
  if (ctaButton) {
    // This function runs whenever the button is clicked
    ctaButton.addEventListener("click", function () {
      console.log("CTA button clicked");
      alert("Welcome! This is your starting point.");
    });
  }

  // code to return leaderboard
  getLeaderboard()
});

// Listen for button click
startGameBtn.addEventListener("click", () => {
  const playerName = playerNameInput.value || "Anonymous";

  // Get selected color
  const selectedColor = document.querySelector('input[name="color"]:checked');
  const color = selectedColor ? selectedColor.value : "red";

  // Get timestamp
  const timestamp = Date.now();

  console.log("Player name:", playerName);
  const now = new Date();
  const timeString = now.toLocaleTimeString(); // e.g., "14:35:07"
  console.log(`Start Game clicked at ${timeString}`);
  
  postPlayer(playerName, color)
});



