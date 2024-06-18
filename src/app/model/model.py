import tensorflow as tf


class RecomenderMF:
    def __init__(self):
        # ---------------- Variables ---------------------
        self.model = tf.keras.models.load_model("../model/model.h5")
   