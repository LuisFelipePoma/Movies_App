
from flask import Flask, render_template
import pandas as pd

#Models
from models.movie import Movie

app = Flask(__name__)
DF = pd.DataFrame()
IDS = pd.DataFrame()

API_KEY = "bac570bf6b8b0f66d91608b71fc3d305"

# Render a Home
@app.route("/")
def template():
    movies = get_movies_ids(20)
    movies = Movie.get_movie_card(movies)
    return render_template("index.html", movies=movies)

# ---------------- DATA ---------------------



def get_movies_ids(n: int) -> list[int]:
    # return a list of ids random
    return IDS.sample(n)[0]

# ---------------- MAIN ---------------------
if __name__ == "__main__":
    IDS = pd.read_json("../model/data_clean/id.json")
    DF = pd.read_json("../model/data_clean/data_clean.json")
    app.run(host="0.0.0.0", port=5000, debug=True)
