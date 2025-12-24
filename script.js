// Custom JavaScript: This is where you add interactivity to your website

// helper functions to obtain url and handle errors
function getUrl() {
  return `http://localhost:5000/`
}


function renderLeaderboard(players) {
  const tbody = document.getElementById("leaderboard-body");
  tbody.innerHTML = ""; // clear old data

  players.forEach((player, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td style="color:${player.colour}">${player.name}</td>
      <td>${player.score}</td>
    `;

    tbody.appendChild(row);
  });
}


function getLeaderboard() {
  let url = `${getUrl()}players/leaderboard`

  console.log(`Leaderboard Requested From: ${url}`)

  fetch(url)
    .then(res => res.json())
    .then(data => {
      //console.log(data);
      renderLeaderboard(data);
    })
    .catch(err => {
      console.error(err);
    });

}

// add new player

async function postPlayer(playerName, color) {

  let url = `${getUrl()}players/add`

  console.log(`Players POST url: ${url}`)
  
  const rawRes = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      "name":playerName,
      "colour":color
    }),
    credentials: 'include'
  })

  const data = await rawRes.json()

  console.log(data)
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
  const playerName = playerNameInput.value;

  console.log("Player name:", playerName);
  const now = new Date();
  const timeString = now.toLocaleTimeString(); // e.g., "14:35:07"
  console.log(`Start Game clicked at ${timeString}`);
  
  // Find colour
  const colorButtons = document.querySelectorAll('input[name="color"]');

  // Add a change listener to each one
  colorButtons.forEach(button => {
    if (button.checked) {
      const color = button.value
      console.log("Selected colour:", color);
      postPlayer(playerName, color)
    } 
  });
});



