# Guide for using api.py

This guide discusses two files: `api.py` and helper module `storage.py`.
requirements.txt includes the flask module needed to run this.

## Structure

- `api.py` - Backend module for all GET, POST, PATCH, and DELETE routes using Flask
- `storage.py` - Helper module for saving and loading json files


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


