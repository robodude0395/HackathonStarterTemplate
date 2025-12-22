"""Module to load and save to leaderboard.json"""
from json import load, dump
import os
PLAYER_FILENAME = "players.json"


def save_to_file(player_score: list[dict]) -> None:
    """Save the current player data to a file"""
    if not os.path.exists(PLAYER_FILENAME):
        with open(PLAYER_FILENAME, "w") as file:
            dump(player_score, file)

    with open(PLAYER_FILENAME, "a") as file:
        for player in player_score:
            dump(player, file)


def load_from_file() -> list[dict]:
    """Load the player data"""
    with open(PLAYER_FILENAME, "r", encoding="utf-8") as file:
        player_data = load(file)
    return player_data


if __name__ == '__main__':
    print(load_from_file())
