// <------------------------------ Variables globales ------------------------------>
const $ = element => document.querySelector(element)
const $cardMovieTemplate = $('#movie-card-template').content
const $miniCardMovieTemplate = $('#movies-mini-card-template').content

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
  const $selectedMovies = $('#movies-selected')
  $selectedMovies.innerHTML = ''
  movies_selected.forEach(movie => {
    const movieCard = document.importNode($miniCardMovieTemplate, true)
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

// ADD EVENTS EVENTS
$cards.forEach(card => {
  card.addEventListener('click', addMovie)
})

// <------------------------------ Recomendar peliculas de la seleccion ------------------------------>
const $sectionRecomendations = $('#movies-recomendations')
const $sectionRecomendationsList = $('#movies-recomendations .list-movies')

function sendMoviesToRecomend () {
  if (movies_selected.length === 0) return
  console.log(movies_selected)
  fetch('/api/movies/recomend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(movies_selected)
  })
    .then(response => response.json())
    .then(movies => {
      $sectionRecomendationsList.innerHTML = ''
      movies.forEach(movie => {
        const movieCard = document.importNode($cardMovieTemplate, true)
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

// ADD EVENTS EVENTS
$btnRecomendations.addEventListener('click', sendMoviesToRecomend)

// <------------------------------ Actualizar el contenido de las peliculas Para ti ------------------------------>
const $moviesForYouList = $('#movies-for-you .list-movies')
const $userIdInput = $('#user-id')
const $btnRefreshForYou = $('#btn-refresh-for-you')
const $iconLoadingForYou = $('#icon-loading-for-you')

function updateForYou () {
  $iconLoadingForYou.style.display = 'flex'
  $btnRefreshForYou.style.display = 'none'
  fetch('/api/movies/for-you')
    .then(response => response.json())
    .then(movies => {
      $moviesForYouList.innerHTML = ''
      movies.forEach(movie => {
        const movieCard = document.importNode($cardMovieTemplate, true)
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
        $moviesForYouList.appendChild(movieCard)
      })
      $iconLoadingForYou.style.display = 'none'
      $btnRefreshForYou.style.display = 'block'
    })
    .catch(error => {
      console.error('Error fetching movies:', error)
      $iconLoadingForYou.style.display = 'none'
    })
}

// ADD EVENTS EVENTS
$userIdInput.addEventListener('change', updateForYou)
$btnRefreshForYou.addEventListener('click', updateForYou)

// <------------------------------ Actualizar el contenido de las peliculas populares ------------------------------>
const $refreshButton = $('#btn-refresh-popular')
const $iconLoadingPopular = $('#icon-loading-popular')
const $moviesPopularList = $('#movies-popular .list-movies')

function updatePopular () {
  // Mostrar el icono de cargando
  $iconLoadingPopular.style.display = 'flex'
  $refreshButton.style.display = 'none'
  fetch('/api/movies')
    .then(response => response.json())
    .then(movies => {
      // Limpiar las películas existentes
      $moviesPopularList.innerHTML = ''

      // Añadir las nuevas películas
      movies.forEach(movie => {
        const movieCard = document.importNode($cardMovieTemplate, true)

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

        // Agregar la película al listado
        $moviesPopularList.appendChild(movieCard)
      })

      // Ocultar el icono de cargando
      $iconLoadingPopular.style.display = 'none'
      $refreshButton.style.display = 'block'
    })
    .catch(error => {
      console.error('Error fetching movies:', error)
      // Ocultar el icono de cargando en caso de error
      $iconLoadingPopular.style.display = 'none'
    })
}

// ADD EVENTS EVENTS
$refreshButton.addEventListener('click', updatePopular)

// <------------------------------ Manejar el filtrado de peliculas ------------------------------>
const $formsFilter = $('#filter')
const $sectionFilter = $('#movies-filter')

function fetchMoviesFilter (evt) {
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
        const movieCard = document.importNode($miniCardMovieTemplate, true)
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
}

// ADD EVENTS EVENTS
$formsFilter.addEventListener('submit', fetchMoviesFilter)

// <------------------------------ CHANGE BEHAVIOUR SCROLL ------------------------------>
const $listMovies = document.querySelectorAll('.list-movies')
// Apply scroll behav
$listMovies.forEach(list => {
  list.addEventListener('wheel', evt => {
    evt.preventDefault() // Avoid vertical scroll
    list.scrollBy({
      left: evt.deltaY * 2.5, // Adjust velocity
      behavior: 'smooth'
    })
  })
})
