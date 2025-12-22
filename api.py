"""Module to manage leaderboard"""

from json import load
from flask import Flask, request

from storage import save_to_file, load_from_file

player_data = load_from_file
app = Flask(__name__)


@app.route("/", methods=["GET"])
def player():
    """API home page with instruction"""
    api_help = """
    /players : get all players
    /player/<int:id> : get player by id
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


if __name__ == "__main__":
    app.config['TESTING'] = True
    app.config['DEBUG'] = True
    app.run(debug=True, host="0.0.0.0", port=5000)
