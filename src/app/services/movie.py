from services.cache_movies import CacheMovies
import requests
import pandas as pd
from datetime import datetime


class Movie:
    def __init__(self):
        # ---------------- Variables ---------------------
        # Read cache
        self.cache = CacheMovies()
        # Read db
        self.repository = pd.read_json("../model/data_clean/data_clean.json")

    # ---------------- Main Methods ---------------------
    def get_movies_list(self, n: int):
        new_movies = self.get_movies(self.get_random_movies(n))
        return list(
            map(
                lambda movie: {
                    "title": movie["title"],
                    "release_date": self.parse_date(movie["release_date"]),
                    "image": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}",
                },
                new_movies,
            )
        )

    def get_movies_filter(self, n: int):
        new_movies = self.get_movies(self.repository.query("'drama' in genres").sample(n))
        return list(
            map(
                lambda movie: {
                    "title": movie["title"],
                    "release_date": self.parse_date(movie["release_date"]),
                    "image": f"https://image.tmdb.org/t/p/w500{movie['poster_path']}",
                },
                new_movies,
            )
        )

    # ---------------- Utils Methods ---------------------

    def get_random_movies(self, n: int):
        # return a list of ids random
        return self.repository.sample(n)["id"]

    def get_movies(self, movies):
        movies_f = []
        for movie in movies:
            m = self.get_movie(movie)
            if m:
                movies_f.append(m)
        return movies_f

    def get_movie(self, movie_id: int):
        # Clave única para el caché basada en movie_id y language
        element = self.cache.get_movie(movie_id)
        # Verificar si el resultado ya está en el caché
        if element:
            return element

        url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key=61b97121b3e651277bb1939a2db63ed3"
        headers = {
            "accept": "application/json",
            # "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiYWM1NzBiZjZiOGIwZjY2ZDkxNjA4YjcxZmMzZDMwNSIsInN1YiI6IjY0YTcwNzE5OTU3ZTZkMDEzOWNmMDc2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.GIVoc-zZaqXUTmvLxuMlEnzjD1BNaQpffoW7v6Z2jPs",
        }
        response = requests.get(url, headers=headers)
        result: dict = response.json()
        if result.get("status_code"):
            return None

        # Almacenar el resultado en el caché antes de devolverlo
        self.cache.add_movie(movie_id, result)
        return result

    def parse_date(self, date_str):
        # Convertir la cadena a objeto datetime
        date = datetime.strptime(date_str, "%Y-%m-%d")
        # Formatear la fecha como 'Month DD, YYYY'
        return date.strftime("%b %d, %Y")
