import tensorflow as tf
import pandas as pd
import numpy as np


class RepositoryMovies:
    def __init__(self):
        self.repository = pd.read_json("../model/data_clean/id.json", orient="records")

    def get_movies_sample(self, n: int):
        return self.repository[0].sample(n).to_list()


class RecomenderCollaborativeBased:
    def __init__(self):
        # ---------------- Variables ---------------------
        # Specify custom objects if mse was a custom metric; otherwise, use TensorFlow's mse
        self.repository = RepositoryMovies()
        self.model = tf.keras.models.load_model("../model/model_CF.h5")

    def predict(self, user_id: int, n: int):
        # Datos para recomendar
        movie_ids = np.array(
            self.repository.get_movies_sample(40)
        )  # IDs de películas disponibles
        # Crear las entradas para el modelo
        user_ids = np.full(len(movie_ids), user_id)

        # Hacer predicciones
        predicted_ratings = self.model.predict([user_ids, movie_ids])

        # Seleccionar las mejores recomendaciones
        top_indices = np.argsort(predicted_ratings[:, 0])[::-1]
        top_movie_ids = movie_ids[top_indices]

        print(
            "Películas recomendadas para el usuario {}: {}".format(
                user_id, top_movie_ids[:n]
            )
        )
        return top_movie_ids[:n]


# class RecomenderContentBased:
# def __init__(self):
# ---------------- Variables ---------------------
# self.model = tf.keras.models.load_model("../model/model.h5")
