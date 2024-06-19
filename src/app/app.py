from services.movie import Movie
from flask import Flask, jsonify, render_template, request
import os
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"
app = Flask(__name__)


# Render a Home
@app.route("/")
def template():
    popular_movies = movie.get_movies_list(n=10)
    foryou_movies = movie.recomend_FC(user=1, n=10)
    return render_template(
        "index.html", popular_movies=popular_movies, foryou_movies=foryou_movies
    )


# ---------------- APIS ---------------------
@app.route("/api/movies")
def get_movies():
    movies = movie.get_movies_list(n=10)
    return jsonify(movies)


# Api for filter
@app.route("/api/movies/filter")
def get_movies_filter():
    # Obtener el parámetro de consulta 'query' (con un valor predeterminado si no se proporciona)
    query = request.args.get("query", default="", type=str)
    # Suponiendo que 'movie.get_movies_filter' acepta un parámetro 'query'
    movies = movie.get_movies_filter(query=query, n=10)
    return jsonify(movies)


@app.route("/api/movies/recomend", methods=["POST"])
def get_movies_recomend():
    # Obtener el cuerpo de la solicitud como JSON
    data = request.get_json()
    if data is None:
        return jsonify({"error": "Invalid data"})
        # Suponiendo que 'movie.get_movies_recomended' acepta un parámetro 'movies' y 'n'
    movies = movie.recomend_CB(movies=data, n=10)
    return jsonify(movies)

@app.route("/api/movies/for-you")
def get_movies_for_you():
    # Obtener el parámetro de consulta 'user' (con un valor predeterminado si no se proporciona)
    user = request.args.get("user", default=1, type=int)
    # Suponiendo que 'movie.get_movies_for_you' acepta un parámetro 'user' y 'n'
    movies = movie.recomend_FC(user=user, n=10)
    return jsonify(movies)

# ---------------- MAIN ---------------------
if __name__ == "__main__":
    movie = Movie()
    app.run(host="0.0.0.0", port=5000, debug=True)
