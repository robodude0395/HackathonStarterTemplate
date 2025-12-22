"""Module to manage leaderboard"""

from datetime import datetime
from flask import Flask, request

from storage import save_to_file, load_from_file

CURRENT_DATETIME = datetime.now()
player_data = load_from_file()

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


@app.route("/initialise_player", methods=["POST"])
def post_score():
    """Post current player score"""
    player = request.json
    if not player:
        return {"error": True, "message": "No story provided to post."}, 404
    player['id'] = len(player_data) + 1  # may have gaps, but no duplicates
    player['colour'] = player.get('colour')  # tuple of 3 int (0, 0, 0) = white
    player['name'] = player.get('name')
    player['score'] = 0  # not including base size
    player['created_at'] = CURRENT_DATETIME
    player['updated_at'] = CURRENT_DATETIME  # to track when size changes

    player_data.append(player)
    save_to_file(player_data)
    return player_data, 201


if __name__ == "__main__":
    app.config['TESTING'] = True
    app.config['DEBUG'] = True
    app.run(debug=True, host="0.0.0.0", port=5000)
