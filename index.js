const searchBtn = document.getElementById('search')
const movieContainer = document.getElementById('movie-container')
const watchlistContainer = document.getElementById('watchlist-container')
let watchlistArray = []

if (localStorage.getItem('watchlist')) {
    watchlistArray = JSON.parse(localStorage.getItem('watchlist'))
}

// click "SEARCH" when enter is pressed
if (document.getElementById("input-text")){
    document.getElementById("input-text").addEventListener("keyup", function(event) {
        if (event.keyCode === 13) {
            document.getElementById("search").click()
        }
    })
}

document.addEventListener('click', function(e){
    if (e.target.id === 'search'){
        renderMovieList()
    } else if (e.target.id === 'add-btn') {
        handleAddButton(e.target.dataset.id)
    } else if (e.target.id === 'remove-btn') {
        handleRemoveButton(e.target.dataset.id)
        renderWatchlist()
    } else if (e.target.id === 'return-btn') {
        window.location.replace("index.html")
        
    }
})

async function renderMovieList(){
    const inputText = document.getElementById('input-text').value
    const moviesArray = await getMoviesByTitle(inputText)
    
    if (moviesArray){
        let html = ''

        moviesArray.forEach(async movie => {
            const data = await getMovieById(movie.imdbID)
            html += getMovieHtml(data)
            movieContainer.innerHTML = html       
        })
    } else {
        movieContainer.innerHTML = `
            <span class="unable">Unable to find what you're looking for. Please try another search</span>
        `
    }
}

async function getMoviesByTitle(title){
    const res = await fetch(`https://www.omdbapi.com/?apikey=5869c884&s=${title}`)
    const data = await res.json()
    return data.Search
}

async function getMovieById(id){
    const res = await fetch(`https://www.omdbapi.com/?apikey=5869c884&i=${id}`)
    const data = await res.json()
    return data
}

function getMovieHtml(movie){
    
    let addedEl = ''
    
    if(checkDuplicade(movie.imdbID)){
        addedEl = `<span class="added">Added to Watchlist</span>`
    } else {
        addedEl = `
        <i class="fa-solid fa-circle-plus" id="add-btn" data-id=${movie.imdbID}></i><span>Watchlist</span>
        `
    }
    
    return `
    <div class="movie">
        <img src="${movie.Poster}">
        <div class="movie-info">
            <div class="movie-title">
                <span class="title">${movie.Title}</span> 
                <i class="fa-solid fa-star"></i>
                <p class="movie-rating">${movie.imdbRating}</p>
            </div>
            <div class="movie-genre">
                <p>${movie.Runtime}</p>
                <p>${movie.Genre}</p>
                <div id=${movie.imdbID}>
                    ${addedEl}
                </div>
            </div>
            <p class="sinopse">${movie.Plot}</p> 
        </div>
    </div>
    `
}

async function handleAddButton(id){
    watchlistArray.unshift(await getMovieById(id))
    localStorage.setItem('watchlist', JSON.stringify(watchlistArray))
    document.getElementById(id).innerHTML = `<span class="added">Added to Watchlist</span>`
}

function handleRemoveButton(id){
    let removeIndex
    watchlistArray.forEach ((movie, index) => {
        if (movie.imdbID === id){
            removeIndex = index
        }
    })
    watchlistArray.splice(removeIndex, 1)
    localStorage.setItem('watchlist', JSON.stringify(watchlistArray))
}

function checkDuplicade(id){
    let checkIdArray = []
    watchlistArray.forEach(movie => checkIdArray.push(movie.imdbID))
    return checkIdArray.includes(id)
}

function renderWatchlist(){
    let html = ''
    watchlistArray.forEach(movie => {
        html += `
        <div class="movie">
            <img src="${movie.Poster}">
            <div class="movie-info">
                <div class="movie-title">
                    <span class="title">${movie.Title}</span> 
                    <i class="fa-solid fa-star"></i>
                    <p class="movie-rating">${movie.imdbRating}</p>
                </div>
                <div class="movie-genre">
                    <p>${movie.Runtime}</p>
                    <p>${movie.Genre}</p>
                    <div>
                        <i class="fa-solid fa-circle-minus" id="remove-btn" data-id=${movie.imdbID}></i><span>Watchlist</span>
                    </div>
                </div>
                <p class="sinopse">${movie.Plot}</p> 
            </div>
        </div>
        `
    })
    if (watchlistContainer && watchlistArray.length > 0){
        watchlistContainer.innerHTML = html  
    }  else if (watchlistContainer && watchlistArray.length === 0){
        watchlistContainer.innerHTML = `
        <div class="empty-watchlist">
            <p>Your watchlist is looking a little empty...</p>
            <div>
                <i class="fa-solid fa-circle-plus" id="return-btn"></i><span>Let's add some movies!</span>
            </div>
        </div>
        `
    }
}

renderWatchlist()



