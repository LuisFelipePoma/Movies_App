import requests
from datetime import datetime

def parse_date(date_str):
    # Convertir la cadena a objeto datetime
    date = datetime.strptime(date_str, "%Y-%m-%d")
    # Formatear la fecha como 'Month DD, YYYY'
    return date.strftime("%b %d, %Y")


class Movie:
    url_images = "https://image.tmdb.org/t/p/w500"
    cache = {}  # Añadir un atributo de clase para el caché

    def __new__(cls, *args, **kwargs):
        raise TypeError("Esta clase no puede ser instanciada")

    @staticmethod
    def get_movie_card(movies: list):
        new_movies = Movie.get_movies(movies)
        return list(
            map(
                lambda movie: {
                    "title": movie["title"],
                    "release_date": parse_date(movie["release_date"]),
                    "image": f"{Movie.url_images}{movie['poster_path']}",
                },
                new_movies,
            )
        )

    @staticmethod
    def get_movies(movies):
        movies_f = []
        for movie in movies:
            m = Movie.get_movie(movie)
            if m:
                movies_f.append(m)
        return movies_f

    @staticmethod
    def get_movie(movie_id: int, language: str = "en-US"):
        # Clave única para el caché basada en movie_id y language
        cache_key = f"{movie_id}_{language}"
        # Verificar si el resultado ya está en el caché
        if cache_key in Movie.cache:
            return Movie.cache[cache_key]

        url = f"https://api.themoviedb.org/3/movie/{movie_id}?language={language}"
        headers = {
            "accept": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYWM1NzBiZjZiOGIwZjY2ZDkxNjA4YjcxZmMzZDMwNSIsInN1YiI6IjY0YTcwNzE5OTU3ZTZkMDEzOWNmMDc2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GIVoc-zZaqXUTmvLxuMlEnzjD1BNaQpffoW7v6Z2jPs",
        }

        response = requests.get(url, headers=headers)
        result: dict = response.json()
        if result.get("status_code") == 34:
            return None

        # Almacenar el resultado en el caché antes de devolverlo
        Movie.cache[cache_key] = result
        return result
