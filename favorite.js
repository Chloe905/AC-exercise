const BASE_URL = 'https://movie-list.alphacamp.io/'
const INDEX_URL = BASE_URL + 'api/v1/movies/'
const POSTER_URL = BASE_URL + 'posters/'
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')



const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || [] // localStorage裡存放資料
let filteredMovies =[] // 放搜尋後的Movies

// search form 監聽 submit & keyup event
searchForm.addEventListener('submit', onSearchFormSubmit)
searchForm.addEventListener('keyup', onSearchFormSubmit)  // keyup event 每按一個鍵就會尋找

// search form 的 監聽function
function onSearchFormSubmit(event) {
  event.preventDefault() // 預設瀏覽器刷新頁面行為
  const input = searchInput.value.trim().toLowerCase() // trim刪除空格 ， toLowerCase全部轉成小寫 進行比對
  // 防止無效字串
  if(!input) {
    return alert('Please enter a valid string !!!')
  }

  filteredMovies = movies.filter((movie) => movie.title.toLowerCase().includes(input)) //includes() 查詢某一字串中是否包含特定字串
  if (!filteredMovies.length){ 
    alert(`Cannot find movie included keywords : "${input}" !`)
    searchForm.reset()  // 若找不到重置
    return
  }
  renderMovieList(filteredMovies)
}

// 渲染 modal
function renderMovieModal(id) {
  const movieModalTitle = document.querySelector('#movie-modal-title')
  const movieModalImage = document.querySelector('#movie-modal-image')
  const movieModalTime = document.querySelector('#movie-modal-time')
  const movieModalDescription = document.querySelector('#movie-modal-description')

  // 先全部清空以防出現上一部殘影
  movieModalTitle.textContent = ''
  movieModalTime.textContent = ''
  movieModalDescription.textContent = ''
  movieModalImage.innerHTML = ''

  // get show movie api
  axios.get(INDEX_URL+id)
  .then( res =>{
    const results = res.data.results
    movieModalTitle.textContent = results.title
    movieModalTime.textContent = `release time: ${results.release_date}`
    movieModalDescription.textContent = results.description
    movieModalImage.innerHTML = `
    <img src="${POSTER_URL + results.image}" alt="movie poster" class="img-fluid">
    `
  }).catch(err => console.log(err))
  
}

// ***function 從favorite移除
function removeFromFavorite (id){
  if (!movies || !movies.length) return //***錯誤處理之一 - 陣列為空即跳出函式
  const findmovie = movies.findIndex(movie => movie.id === id) // findIndex找到傳入id在movies中的位置
  if (findmovie === -1) return // ***錯誤處理之二 - 若找不到，會回傳-1
  movies.splice(findmovie,1)
  localStorage.setItem('favoriteMovies',JSON.stringify(movies)) //存回localStorage
  renderMovieList(movies) // 渲染頁面
}

// datapanel 裝監聽器，打開對應 id 的 modal，或加入favorite
  dataPanel.addEventListener('click',function onShowMovieClicked(event){
    const target = event.target
    if (target.classList.contains('btn-show-movie')) {
      renderMovieModal(Number(target.dataset.id)) // 記得加Number，轉換型別
    } else if (target.matches('.btn-remove-favorite')) {
      removeFromFavorite(Number(target.dataset.id))
    }
})

// 渲染電影清單
function renderMovieList(data) {
  let htmlContent = ''
  data.forEach(item => {
    htmlContent += `
    <div class="col-sm-3 ">
      <div class="mb-2">
        <div class="card">
          <img src="${POSTER_URL+item.image}" class="card-img-top" alt="Movie poster">  
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer">  
            <a href="#" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</a>
            <a href="#" class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</a>
          </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = htmlContent
}

renderMovieList(movies)

