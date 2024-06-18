from flask import Flask, jsonify, render_template
from services.movie import Movie

app = Flask(__name__)

# Render a Home
@app.route("/")
def template():
    movies = movie.get_movies_list(n=10)
    return render_template("index.html", movies=movies)


# ---------------- APIS ---------------------
@app.route("/api/movies")
def get_movies():
    movies = movie.get_movies_list(n=10)
    return jsonify(movies)


# Api for filter
@app.route("/api/movies/filter")
def get_movies_filter():
    movies = movie.get_movies_filter(n=10)
    return jsonify(movies)


# ---------------- MAIN ---------------------
if __name__ == "__main__":
    movie = Movie()
    app.run(host="0.0.0.0", port=5000, debug=True)
