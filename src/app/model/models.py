import tensorflow as tf


class RecomenderCollaborativeBased:
    def __init__(self):
        # ---------------- Variables ---------------------
        self.model = tf.keras.models.load_model("../model/model.h5")


# class RecomenderContentBased:
    # def __init__(self):
        # ---------------- Variables ---------------------
        # self.model = tf.keras.models.load_model("../model/model.h5")
