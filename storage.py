"""Module to load and save to leaderboard.json"""
from json import load, dump
PLAYER_FILENAME = "players.json"


def save_to_file(player_scores: list[dict]) -> None:
    """Save the current player data to a file"""
    with open(PLAYER_FILENAME, "w") as file:
        dump(player_scores, file)


def load_from_file() -> list[dict]:
    """Load the player data"""
    with open(PLAYER_FILENAME, "r", encoding="utf-8") as file:
        player_data = load(file)
    return player_data


if __name__ == '__main__':
    print(load_from_file())
