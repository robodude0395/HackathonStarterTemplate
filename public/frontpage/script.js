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
      <td style="color:rgb(${player.colour})">${player.name}</td>
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


