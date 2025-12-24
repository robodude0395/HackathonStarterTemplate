// Custom JavaScript: This is where you add interactivity to your website

//code to return vals form buttons

const startGameBtn = document.getElementById("startGameBtn");
const playerNameInput = document.getElementById("playerName");

// Listen for button click
startGameBtn.addEventListener("click", () => {
  const playerName = playerNameInput.value || "Anonymous";

  // Get selected color
  const selectedColor = document.querySelector('input[name="color"]:checked');
  const color = selectedColor ? selectedColor.value : "red";

  // Get timestamp
  const timestamp = Date.now();

  console.log("Player name:", playerName);
  console.log("Selected colour:", color);
  console.log("Timestamp:", timestamp);

  // Store data in URL parameters and redirect to agario page
  window.location.href = `/agario/index.html?name=${encodeURIComponent(playerName)}&color=${color}&timestamp=${timestamp}`;
});


const colorButtons = document.querySelectorAll('input[name="color"]');

// Add a change listener to each one
colorButtons.forEach(button => {
  button.addEventListener("change", () => {
    console.log("Selected colour:", button.value);
  });
});


// Edit Leaderboard to contain real data
async function getLeaderboard() {
  try {
    let url = `${getUrl()}players/leaderboard`;
    console.log(`Leaderboard GET url: ${url}`);

    const rawRes = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });

    const data = await rawRes.json();
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

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

  // get leaderboard data
  const playerData = getLeaderboard()
  
});
