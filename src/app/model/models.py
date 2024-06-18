import tensorflow as tf
import pandas as pd
import numpy as np
import faiss


class RepositoryMovies:
    def __init__(self):
        self.repository = pd.read_json(
            "../model/data_clean/data_clean.json", orient="records"
        )

    def get_movies_sample(self, n: int):
        return self.repository["id"].sample(n).to_list()

    def get_movie_by_title(self, title):
        return self.repository[self.repository["title"] == title].index[0]


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


class RecomenderContentBased:
    def __init__(self):
        # ---------------- Variables ---------------------
        # Cargar embeddings y el índice FAISS
        self.embeddings = np.load("../model/assets/embeddings.npy")
        self.index = faiss.read_index("../model/assets/embedding_index.faiss")
        self.repository = RepositoryMovies()

    def get_recommendation_faiss(self, title: list, k=10):
        idx = self.repository.get_movie_by_title(title)
        D, I = self.index.search(self.embeddings[idx : idx + 1], k)
        movie_indices = I[0][1:]
        return movie_indices
    
    def get_recommendations_faiss(self,titles, k=10):
    # Obtener los índices de las películas que coinciden con los títulos
        indices = [self.repository.get_movie_by_title(title) for title in titles]
        
        # Obtener los embeddings promedio de las películas
        avg_embedding = np.mean(self.embeddings[indices], axis=0, keepdims=True)
        
        # Buscar los k vecinos más cercanos al embedding promedio
        D, I = self.index.search(avg_embedding, k)
        
        # I[0][1:] contiene los índices de las películas más similares (excluyendo las ingresadas)
        movie_indices = I[0][1:]
        
        # Devolver los títulos de las películas recomendadas
        return movie_indices