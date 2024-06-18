// <------------------------------ Variables globales ------------------------------>
const $ = element => document.querySelector(element)
// <------------------------------ Agregar peliculas a la seleccion ------------------------------>
const movies_selected = []
let $cards = document.querySelectorAll('.card')
let $minicards = document.querySelectorAll('.mini-card')
const $btnRecomendations = $('#btn-recomend')

// create funcion event onclik
function addMovie (e) {
  const $movie = e.currentTarget
  // Get the movie card
  const p = $movie.querySelectorAll('p')
  const movie = {
    id: $movie.id,
    title: p[0].textContent, // Get the text content of the first <p> element
    image: $movie.querySelector('img').src,
    release_date: p[1].textContent // Get the text content of the second <p> element
  }

  // Verify movie with id doesnt exist
  if (movies_selected.find(m => m.id === movie.id)) return
  // Add style
  $movie.classList.add('selected')
  movies_selected.push(movie)
  updateSelectedMovies()
}

function removeMovie (e) {
  const $movie = e.currentTarget
  const id = $movie.id
  const index = movies_selected.findIndex(m => m.id === id)
  movies_selected.splice(index, 1)
  //remove style
  $cards.forEach(card => {
    if (card.id === id) {
      card.classList.remove('selected')
    }
  })
  // remove style
  $minicards.forEach(minicard => {
    if (minicard.id === id) {
      minicard.classList.remove('selected')
    }
  })

  updateSelectedMovies()
}

function updateSelectedMovies () {
  const $selectedMovies = $('#movies_selected')
  $selectedMovies.innerHTML = ''
  movies_selected.forEach(movie => {
    const movieCard = document.importNode($filterCardTemplate, true)
    // Añadimos el id
    movieCard.querySelector('.mini-card').id = movie.id
    // Añadimos la imagen
    const movieImage = movieCard.querySelector('img')
    movieImage.src = movie.image
    movieImage.alt = movie.title
    // Añadimos el titulo
    const movieTitle = movieCard.querySelector('.title')
    movieTitle.textContent = movie.title
    // Añadimos la fecha
    const movieDate = movieCard.querySelector('.release-date')
    movieDate.textContent = movie.release_date
    // Add event OnClick
    movieCard.querySelector('.mini-card').addEventListener('click', removeMovie)

    // Agregar la pelicula seleccionada
    $selectedMovies.appendChild(movieCard)
  })
}

// Add event OnClick
$cards.forEach(card => {
  card.addEventListener('click', addMovie)
})

// <------------------------------ Recomendar peliculas de la seleccion ------------------------------>
const $sectionRecomendations = $('#movies-recomendations')
const $sectionRecomendationsList = $('#movies-recomendations .list-movies')
function sendMoviesToRecomend () {
  if (movies_selected.length === 0) return
  fetch('/api/movies/recomend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(movies_selected)
  })
    .then(response => response.json())
    .then(movies => {
      // console.log(movies)
      $sectionRecomendationsList.innerHTML = ''
      movies.forEach(movie => {
        const movieCard = document.importNode($movieTemplate, true)
        // Añadimos el id
        movieCard.querySelector('.card').id = movie.id

        // Añadimos la imagen
        const movieImage = movieCard.querySelector('img')
        movieImage.src = movie.image
        movieImage.alt = movie.title

        // Añadimos el titulo
        const movieTitle = movieCard.querySelector('.title')
        movieTitle.textContent = movie.title

        // Añadimos la fecha
        const movieDate = movieCard.querySelector('.release-date')
        movieDate.textContent = movie.release_date

        // Add event OnClick

        movieCard.querySelector('.card').addEventListener('click', e => {
          $cards = document.querySelectorAll('.card')
          addMovie(e)
        })
        $sectionRecomendationsList.appendChild(movieCard)
        $sectionRecomendations.style.display = 'block'
      })
    })
    .catch(error => {
      console.error('Error fetching movies:', error)
    })
}

$btnRecomendations.addEventListener('click', sendMoviesToRecomend)

// <------------------------------ Actualizar el contenido de las peliculas Para ti ------------------------------>
const $moviesForYouList = $('#movies-for-you .list-movies')
const $movieForYouTemplate = $('#movie-template').content
const $userId = $('#user-id').textContent

function updateForYou(){
	fetch('/api/movies/for-you')
	.then(response => response.json())

}

// <------------------------------ Actualizar el contenido de las peliculas populares ------------------------------>
const $refreshButton = $('#refresh-button')
const $loadingIcon = $('#loading-icon')
const $moviesPopularList = $('#movies_popular .list-movies')
const $movieTemplate = $('#movie-template').content

$refreshButton.addEventListener('click', () => {
  // Mostrar el icono de cargando
  $loadingIcon.style.display = 'flex'
  $refreshButton.style.display = 'none'
  fetch('/api/movies')
    .then(response => response.json())
    .then(movies => {
      // Limpiar las películas existentes
      $moviesPopularList.innerHTML = ''

      // Añadir las nuevas películas
      movies.forEach(movie => {
        const movieCard = document.importNode($movieTemplate, true)

        // Añadimos el id
        movieCard.querySelector('.card').id = movie.id

        // Añadimos la imagen
        const movieImage = movieCard.querySelector('img')
        movieImage.src = movie.image
        movieImage.alt = movie.title

        // Añadimos el titulo
        const movieTitle = movieCard.querySelector('.title')
        movieTitle.textContent = movie.title

        // Añadimos la fecha
        const movieDate = movieCard.querySelector('.release-date')
        movieDate.textContent = movie.release_date

        // Add event OnClick
        movieCard.querySelector('.card').addEventListener('click', addMovie)

        $moviesPopularList.appendChild(movieCard)
      })

      // Ocultar el icono de cargando
      $loadingIcon.style.display = 'none'
      $refreshButton.style.display = 'block'
    })
    .catch(error => {
      console.error('Error fetching movies:', error)
      // Ocultar el icono de cargando en caso de error
      $loadingIcon.style.display = 'none'
    })
})

// <------------------------------ Manejar el filtrado de peliculas ------------------------------>
const $formsFilter = $('#filter')
const $sectionFilter = $('#movies_filter')
const $filterCardTemplate = $('#movies-card-filter-template').content

$formsFilter.addEventListener('submit', evt => {
  evt.preventDefault()
  const formData = new FormData($formsFilter)
  const query = formData.get('query')
  // transform qery to url variable
  const url = `/api/movies/filter?query=${encodeURIComponent(query)}`
  fetch(url)
    .then(response => response.json())
    .then(movies => {
      $sectionFilter.innerHTML = ''
      if (movies.length === 0) {
        $sectionFilter.innerHTML = 'Not found movies :('
      }
      movies.forEach(movie => {
        const movieCard = document.importNode($filterCardTemplate, true)
        // Añadimos el id
        movieCard.querySelector('.mini-card').id = movie.id
        // Añadimos la imagen
        const movieImage = movieCard.querySelector('img')
        movieImage.src = movie.image
        movieImage.alt = movie.title
        // Añadimos el titulo
        const movieTitle = movieCard.querySelector('.title')
        movieTitle.textContent = movie.title
        // Añadimos la fecha
        const movieDate = movieCard.querySelector('.release-date')
        movieDate.textContent = movie.release_date
        // Add event OnClick
        movieCard
          .querySelector('.mini-card')
          .addEventListener('click', addMovie)
        $sectionFilter.appendChild(movieCard)
        $minicards = document.querySelectorAll('.mini-card')
      })
    })
    .catch(error => {
      console.error('Error fetching movies:', error)
    })
})



// <------------------------------ Cambiar el comportamiento del scroll en las listas ------------------------------>
const $listMovies = document.querySelectorAll('.list-movies')
// Apply scroll behav
$listMovies.forEach(list => {
  list.addEventListener('wheel', evt => {
    evt.preventDefault() // Evita el desplazamiento vertical por defecto
    list.scrollBy({
      left: evt.deltaY * 2.5, // Ajusta la velocidad del desplazamiento
      behavior: 'smooth' // Desplazamiento suave
    })
  })
})