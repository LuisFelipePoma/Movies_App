// <------------------------------ Variables globales ------------------------------>
const $ = element => document.querySelector(element)
// <------------------------------ Agregar peliculas a la seleccion ------------------------------>
const movies_selected = []
const $cards = document.querySelectorAll('.card')

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
  movies_selected.push(movie)
  console.log(movies_selected)
  updateSelectedMovies()
}

// Add event OnClick
$cards.forEach(card => {
  card.addEventListener('click', addMovie)
})

function removeMovie (e) {
  const $movie = e.currentTarget
  const id = $movie.id
  const index = movies_selected.findIndex(m => m.id === id)
  movies_selected.splice(index, 1)
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
  const url = `/api/movies/filter?query=${query}`
  fetch(url)
    .then(response => response.json())
    .then(movies => {
      $sectionFilter.innerHTML = ''
      if (movies.length === 0) {
        $sectionFilter.innerHTML = 'Not found movies :('
      }
      console.log(movies)
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
      })
    })
    .catch(error => {
      console.error('Error fetching movies:', error)
    })
})
