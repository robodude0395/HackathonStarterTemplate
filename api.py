"""Module to manage leaderboard"""

from datetime import datetime
from flask import Flask, request
from flask_cors import CORS

from storage import save_to_file, load_from_file

BOARD_SIZE = 10  # number of players visible on the board
EMPTY = "-"  # used when not enough players for full leaderboard
DEFAULT_SCORE = {"name": EMPTY, "colour": EMPTY, "score": 0}

app = Flask(__name__)
CORS(
    app,
    supports_credentials=True,
    origins=[
        "http://localhost:8000",
        "http://[::]:8000"
    ]
)


@app.route("/", methods=["GET"])
def player():
    """API home page with instruction"""
    api_help = """

        /players : get all players

        /players/<int:id> : get player by id

        /players/leaderboard : get leaderboard of top players

        /players/add : add new player to player data

        /players/<int:id>/update : patch or delete player by id
    """
    return api_help


@app.route("/players", methods=["GET"])
def get_all_players():
    """Return all players"""
    player_data = load_from_file()
    return player_data, 200


@app.route("/players/<id>", methods=["GET"])
def get_player_by_id(id):
    """Return player found with matching id"""
    player_data = load_from_file()
    for player in player_data:
        if player.get("id") == id:
            return player, 200

    return {"error": f"player with id {id} not found."}, 404


@app.route("/players/leaderboard", methods=["GET"])
def get_player_leaderboard():
    """Return top players based on score"""
    player_data = load_from_file()
    leaderboard = sorted(
        player_data, key=lambda player: int(player['score']), reverse=True)[:BOARD_SIZE]

    # if not enough current players for board size
    high_score_count = len(leaderboard)
    if high_score_count < BOARD_SIZE:
        for _ in range(BOARD_SIZE - high_score_count):
            leaderboard.append(DEFAULT_SCORE)

    return leaderboard[:BOARD_SIZE], 200


@app.route("/players/add", methods=["POST"])
def post_score():
    """Initialise new player with starting data"""
    player = request.json
    if not player:
        return {"error": True, "message": "No player data provided to post."}, 404

    player['id'] = player.get('id')
    player['name'] = player.get('name')
    player['colour'] = player.get('colour')  # tuple of 3 int (0, 0, 0) = white
    player['score'] = 0  # not including start/initial size
    player['created_at'] = str(datetime.now())
    player['updated_at'] = str(datetime.now())  # to track when size changes

    player_data = load_from_file()
    player_data.append(player)
    save_to_file(player_data)
    return player_data, 201


@app.route("/players/<id>/update", methods=["PATCH", "DELETE"])
def update_player_by_id(id):
    """Update or delete players and their score"""
    session_player = get_player_by_id(id)
    player, status_code = session_player[0], session_player[1]
    if status_code != 200:
        return {"error": True, "message": f"No player with id {id} was found"}, 404

    player_data = load_from_file()
    player_data.remove(player)

    if (request.method == "PATCH"):
        update = request.json
        if not update:
            return {"error": True, "message": "No player update was provided"}, 404
        # score = diff in start and current size
        updated_score = update.get('score')
        if not updated_score:
            return {"error": True, "message": "Error getting updated score"}, 404
        player['score'] = updated_score
        player['updated_at'] = str(datetime.now())
        player_data.append(player)
        save_to_file(player_data)

    return player_data, 200


if __name__ == "__main__":
    app.config['TESTING'] = True
    app.config['DEBUG'] = True
    app.run(debug=True, host="0.0.0.0", port=5000)
