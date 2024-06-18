import json
import threading
import time

class CacheMovies:
    def __init__(self):
        self.cache = self._read_cache()
        self._init_thread()

    def add_movie(self, movie_id, movie):
        self.cache[movie_id] = movie

    def get_movie(self, movie_id):
        return self.cache.get(movie_id)

    def _read_cache(self):
        try:
            with open("./services/cache.json", "r") as file:
                return json.load(file)
        except FileNotFoundError:
            return {}

    def _save_cache(self):
        with open("./services/cache.json", "w") as file:
            json.dump(self.cache, file)

    def save_cache_periodically(self, interval=60):
        while True:
            print("Guardando..")
            time.sleep(interval)
            self._save_cache()

    def _init_thread(self):
        # Iniciar el hilo para guardar el caché periódicamente cada 5 minutos (300 segundos)
        cache_saving_thread = threading.Thread(target=self.save_cache_periodically)
        cache_saving_thread.daemon = True
        cache_saving_thread.start()
