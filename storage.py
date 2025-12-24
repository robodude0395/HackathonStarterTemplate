"""Module to load and save to players.json"""
from json import load, dump
from os import path

PLAYER_FILENAME = "players.json"


def create_file() -> None:
    """Create the destination file if it doesn't exist"""
    data = [{"name": '-', "colour": '-', "score": 0}]
    with open(PLAYER_FILENAME, "w", encoding="utf-8") as file:
        dump(data, file, indent=2)


def save_to_file(player_scores: list[dict]) -> None:
    """Save the current player data to a file"""
    with open(PLAYER_FILENAME, "w", encoding="utf-8") as file:
        dump(player_scores, file, indent=2)


def load_from_file() -> list[dict]:
    """Load the player data"""
    if not path.exists(PLAYER_FILENAME):
        create_file()

    with open(PLAYER_FILENAME, "r", encoding="utf-8") as file:
        player_data = load(file)
    return player_data


if __name__ == '__main__':
    print(load_from_file())
