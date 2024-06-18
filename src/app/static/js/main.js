const $ = element => document.querySelector(element)
const $listMovies = document.querySelectorAll('.list-movies')
const refreshButton = $('#refresh-button')
const loadingIcon = $('#loading-icon')
const moviesContainer = $('#movies_popular .list-movies')
const movieTemplate = $('#movie-template').content

refreshButton.addEventListener('click', () => {
  // Mostrar el icono de cargando
  loadingIcon.style.display = 'flex'
  refreshButton.style.display = 'none'
  fetch('/api/movies')
    .then(response => response.json())
    .then(movies => {
      // Limpiar las películas existentes
      moviesContainer.innerHTML = ''

      // Añadir las nuevas películas
      movies.forEach(movie => {
        const movieCard = document.importNode(movieTemplate, true)

        const movieImage = movieCard.querySelector('img')
        movieImage.src = movie.image
        movieImage.alt = movie.title

        const movieTitle = movieCard.querySelector('.title')
        movieTitle.textContent = movie.title

        const movieDate = movieCard.querySelector('.release-date')
        movieDate.textContent = movie.release_date

        moviesContainer.appendChild(movieCard)
      })

      // Ocultar el icono de cargando
      loadingIcon.style.display = 'none'
      refreshButton.style.display = 'block'
    })
    .catch(error => {
      console.error('Error fetching movies:', error)
      // Ocultar el icono de cargando en caso de error
      loadingIcon.style.display = 'none'
    })
})

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

const $formsFilter = $('#filter')
