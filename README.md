# Sigmar.io

Eat the dots. Grow. Watch everything else Shrink.
Grow and Shrink with us [here](http://hackathon-team-6-lb-706940063.eu-west-2.elb.amazonaws.com/).

## Running the Project 

# Sigmar.io

Eat the dots. Grow. Watch everything else Shrink.

Play the game [here](http://35.177.38.169:8000/).

# Running the Project Locally

## Project Frontend Structure

- `index.html` - Main HTML file with Bootstrap and responsive layout
- `styles.css` - Custom CSS styles
- `script.js` - JavaScript for interactivity

Run a local server using two terminals. Run the following in seperate terminals:

```bash
python api.py
```
And

```bash
node server.js
```

Then open `http://localhost:8000` in your browser.


## Guide for using api.py

This guide discusses two files: `api.py` and helper module `storage.py`.
requirements.txt includes the flask module needed to run this.

## Project Backend Structure

- `api.py` - Backend module for all GET, POST, PATCH, and DELETE routes using Flask
- `storage.py` - Helper module for saving and loading json files
- `players.json` - Database of players (not included in repo)

## Defining JSON Storage

The filepath for the destination json file to store all players is defined in `storage.py`. This repository stores player data in `players.json`.

## Running the Backend

Run a local server using python.

```bash
python api.py
```

Then open `http://localhost:5000` in your browser.

Any changes to the files will automatically reflect in the browser upon refresh.

## API Routes

- `/players` - Get all players currently stored in the json file
- `/players/<int:id>` : Get player by given id
- `/players/leaderboard` : Get leaderboard of top players, max number as defined in global variable in `api.py`
- `/players/add` : Post new player to player data in storage json
- `/players/<int:id>/update` : Patch or Delete player by given id


