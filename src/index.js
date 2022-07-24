import {PhotoApiService} from './js/fetch-photos.js'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import refs from './js/refs';
import { throttle } from 'throttle-debounce';
import {calcPhotosOnPage, scrollToTheEnd, paintMarkUp} from './js/serviceCalc'

refs.searchBth.addEventListener('click', onSearch)
refs.loadMore.addEventListener('click', onLoadMore)


Notify.init({position:'center-top',fontSize:'20px'})

const photoApiService = new PhotoApiService();
let perPage = 40;

function onSearch() {
    refs.error400.classList.add('invisible')
    refs.gallery.innerHTML = '';
    window.scrollTo(0, 0)

    photoApiService.resetPage();
    let query =  refs.searchInput.value;
    if (!query) return Notify.failure(`enter something`);
    photoApiService.query = query
    // localStorage.setItem(query, query);
    refs.loadMore.classList.add('invisible')

    photoApiService.fetchPhotos(refs.loadMoreBtn.checked ? calcPhotosOnPage() : '40')
        .then(data => 
        {
        let {hits: photos} = data.data; 

       
        if (photos.length) {
            if (refs.loadMoreBtn.checked) refs.loadMore.classList.remove('invisible')

            if (refs.infiniteScrollBtn.checked) {
                window.addEventListener("scroll", checkPosition)
                window.addEventListener("resize", checkPosition)
                }
            Notify.success(`found ${data.data.total} photos on your request`);}
        else Notify.failure(`Can't find any photos on your request`);
        
        
        paintMarkUp(data)
        if (refs.loadMoreBtn.checked) scrollToTheEnd()
        
              
        return lightbox.refresh();

         })
        .catch(error => {
            
            return console.log(`Something goes 1 wrong + ${error.response.status}`)})
        
}
const checkPosition =
    throttle(250, () => { 
        
        const height = document.body.offsetHeight
        //console.log('height', height)
        const screenHeight = window.innerHeight
        //console.log('screenHeight', screenHeight)
        const scrolled = window.scrollY
        //console.log('scrolled', scrolled)
        const threshold = height - screenHeight / 4
        //console.log('treshold', threshold)
        const position = scrolled + screenHeight
        //console.log('positon', position)
        if (position >= threshold) { 
        
           onLoadMore()
        }})
  









refs.infiniteScrollBtn.addEventListener('click', onInfiniteScrollBnt)
refs.loadMoreBtn.addEventListener('click', onLoadMoreBnt)

function onInfiniteScrollBnt() {
    window.addEventListener("scroll",  checkPosition)
    window.addEventListener("resize",  checkPosition)
    refs.loadMore.classList.add('invisible')
}
function onLoadMoreBnt() {
    console.log(refs.error400.classList.contains('invisible'))
    if (refs.error400.classList.contains('invisible') && refs.gallery.childElementCount!==0) refs.loadMore.classList.remove('invisible')
    window.removeEventListener("scroll", checkPosition)
    window.removeEventListener("resize", checkPosition) 
}


function onLoadMore() {
    if (refs.loadMoreBtn.checked) refs.loadMore.classList.add('loading'); 
    perPage = refs.loadMoreBtn.checked ? calcPhotosOnPage() : 40
    photoApiService.fetchPhotos(perPage)
        .then(data => 
            {photoApiService.increaseDownloadedPhotosCount(perPage)
                if (photoApiService.downloadedPhotos >= data.data.total) console.log(5)
                paintMarkUp(data)
                 if (refs.loadMoreBtn.checked) {
                    scrollToTheEnd();
                    
                    refs.loadMore.classList.remove('loading');
                 }
                 console.log(data)
            return lightbox.refresh();

         })
        .catch(error=> {
            if (error.response.status === 400) {
            refs.loadMore.classList.add('invisible')  
            refs.loadMore.classList.remove('loading');
            window.removeEventListener("scroll", checkPosition)
            window.removeEventListener("resize", checkPosition) 
            refs.error400.classList.remove('invisible') }
            console.log(`Something goes 1 wrong + ${error.response.status}`)})
        
    
}

let lightbox = new SimpleLightbox(
    '.gallery a', 
    { 
        overlayOpacity: 0.5, 
        widthRatio: 1.0, 
        heightRatio: 1.0, 
        captionDelay: 250,
    });











