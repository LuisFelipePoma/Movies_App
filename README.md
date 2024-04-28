# Recomendation_System
---
## Index
- [Recomendation\_System](#recomendation_system)
	- [Index](#index)
	- [Objetivo del trabajo](#objetivo-del-trabajo)
	- [Nombre de los alumnos participantes](#nombre-de-los-alumnos-participantes)
	- [Breve descripción del dataset (se puede adjuntar el archivo PDF)](#breve-descripción-del-dataset-se-puede-adjuntar-el-archivo-pdf)
		- [`movies_metadata.csv`](#movies_metadatacsv)
		- [`ratings.csv`](#ratingscsv)
		- [`keywords.csv`](#keywordscsv)
		- [`credits.csv`](#creditscsv)
	- [Conclusiones](#conclusiones)
	- [Licencia](#licencia)
---

## Objetivo del trabajo
- Implementar un sistema de recomendacion de peliculas que permita al usuario encontrar filmes de acuerdo a sus intereses y nuevos a explorar usando redes neuronales.
## Nombre de los alumnos participantes
- André Dario Pilco Chiuyare
- Luis Felipe Poma Astete
  
## Breve descripción del dataset (se puede adjuntar el archivo PDF)

### `movies_metadata.csv`
| Columna               | Descripción                                                                       |
|-----------------------|-----------------------------------------------------------------------------------|
| Id                    | Identificador único para cada película.                                           |
| adult                 | Indica si la película es para adultos (true/false).                               |
| belongs_to_collection | Información sobre la colección a la que pertenece la película, si la tiene.       |
| budget                | Presupuesto de la película en dólares.                                             |
| genres                | Géneros asociados con la película.                                                |
| original_language     | Idioma original en el que se produjo la película.                                 |
| overview              | Breve descripción general de la trama de la película.                              |
| popularity            | Puntuación de popularidad de la película.                                         |
| production_companies  | Compañías productoras involucradas en la realización de la película.              |
| release_date          | Fecha de lanzamiento de la película.                                               |
| revenue               | Ingresos generados por la película en taquilla.                                   |
| runtime               | Duración de la película en minutos.                                               |
| spoken_languages      | Idiomas hablados en la película.                                                   |
| status                | Estado de la película (por ejemplo, lanzada, en producción, etc.).                |
| tagline               | Lema o eslogan asociado con la película.                                           |
| vote_average          | Promedio de las calificaciones de la película.                                     |
| vote_count            | Número total de votos recibidos por la película.                                   |

### `ratings.csv`
| Columna   | Descripción                                                            |
|-----------|------------------------------------------------------------------------|
| user_id   | Identificador único del usuario que proporcionó la calificación.       |
| movie_id  | Identificador único de la película que recibió la calificación.        |
| rating    | Calificación otorgada por el usuario a la película (escala del 1 al 5).|
| timestamp | Marca de tiempo que indica cuándo se registró la calificación.         |

### `keywords.csv`
| Columna  | Descripción                                                 |
|----------|-------------------------------------------------------------|
| Id       | Identificador único de la película.                         |
| keywords | Conjunto de palabras clave que describen la película.       |

### `credits.csv`
| Columna | Descripción                                                                        |
|---------|------------------------------------------------------------------------------------|
| Id      | Identificador único de la película.                                                 |
| crew    | Lista de información de cada involucrado en la película (director, escritor, etc.).|
| cast    | Lista de información de cada actor y qué personaje interpreta en la película.      |

## Conclusiones 
... en proceso
## Licencia
Este trabajo está disponible bajo la licencia [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
