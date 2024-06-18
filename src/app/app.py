from flask import Flask, jsonify, render_template, request
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
    # Obtener el parámetro de consulta 'query' (con un valor predeterminado si no se proporciona)
    query = request.args.get('query', default='', type=str)
    # Suponiendo que 'movie.get_movies_filter' acepta un parámetro 'query'
    movies = movie.get_movies_filter(query=query, n=10)
    return jsonify(movies)


# ---------------- MAIN ---------------------
if __name__ == "__main__":
    movie = Movie()
    app.run(host="0.0.0.0", port=5000, debug=True)
