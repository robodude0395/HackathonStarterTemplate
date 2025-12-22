"""Module to manage leaderboard"""

from json import load
from flask import Flask

app = Flask(__name__)

# Load the player.json data into a dict
with open("player.json", "r", encoding="utf-8") as file:
    player_data = load(file)

# Load the colour.json data into a dict
with open("colour.json", "r", encoding="utf-8") as file:
    player_colours = load(file)


@app.route("/", methods=["GET"])
def player():
    """API home page with instruction"""
    api_help = """
    /players : get all players
    /player/<int:id> : get player by id
    /player/<int:id>/colour: return colour of player with id
    /colour/<colour> return all ids with specified colour
    """
    return api_help


@app.route("/players", methods=["GET"])
def get_all_players():
    """Return all players"""
    return player_data, 200


@app.route("/player/<int:id>", methods=["GET"])
def get_player_by_id(id):
    """Return player found with matching id"""
    for player in player_data:
        if player.get("id") == id:
            return player, 200

    return {"error": f"player with id {id} not found."}, 404


@app.route("/player/<int:id>/colour", methods=["GET"])
def get_player_colour_by_id(id):
    """Return colour of player with id"""
    for player in player_colours:
        if player.get("player_id") == id:
            return player.get('colour')

    return {"error": f"player with id {id} not found."}, 404


@app.route("/colour/<colour>", methods=["GET"])
def get_player_of_colour(colour):
    """Return all players with a colour"""

    colour = colour.lower()
    matching_ids = []

    for player in player_data:
        their_colour = player.get("colour")
        if their_colour == colour:
            matching_ids.append(player.get("player_id"))

    if not matching_ids:
        return {"error": f"No player with colour {colour} found."}, 404

    return matching_ids, 200


if __name__ == "__main__":
    app.config['TESTING'] = True
    app.config['DEBUG'] = True
    app.run(debug=True, host="0.0.0.0", port=5000)
