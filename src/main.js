import {PhotoApiService} from './js/fetch-photos.js'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './js/refs.js';
import { throttle } from 'throttle-debounce';
import {calcPhotosOnPage, scrollToTheEnd, paintMarkUp} from './js/serviceCalc'


refs.searchBth.addEventListener('click', () => onSearch('search bar'))
refs.loadMore.addEventListener('click', () => onSearch('load more button'))


Notify.init({position:'center-top',fontSize:'20px'})

const photoApiService = new PhotoApiService();
let perPage = 40;

const source = {
    SEARCH_BAR: 'search bar',
    INFINITY_SCROLL: 'infinity scroll',
    LOAD_MORE_BTN: 'load more button',
}

function onSearch(searchSource) {  
    console.log(searchSource)
    console.log(source.SEARCH_BAR)
    if (searchSource===source.SEARCH_BAR) {
    photoApiService.resetDownloadedPhotosCount()
    refs.error400.classList.add('invisible')
    refs.gallery.innerHTML = '';
    window.scrollTo(0, 0)
    photoApiService.resetPage();
    let query =  refs.searchInput.value;
    console.log(query)
    if (!query) return Notify.failure(`enter something`);
    photoApiService.query = query
    
    }

    refs.loadMore.classList.remove('invisible')
    refs.loadMore.classList.add('loading'); 
    perPage = refs.loadMoreBtn.checked ? calcPhotosOnPage() : 40;

    photoApiService.fetchPhotos(perPage)
        .then(data => 
        {
        let {hits: photos} = data.data; 
        let {total: totalAvaliblePhotos} = data.data;

        
        
            photoApiService.increaseDownloadedPhotosCount(perPage)
        if (searchSource===source.SEARCH_BAR) {    
        if (photos.length) {
            refs.loadMore.classList.remove('invisible')

            if (refs.infiniteScrollBtn.checked) {
                window.addEventListener("scroll", checkPosition)
                window.addEventListener("resize", checkPosition)
                }
            Notify.success(`found ${data.data.total} photos on your request`);}
            else Notify.failure(`Can't find any photos on your request`);
            }
        
        paintMarkUp(data)
        if (refs.loadMoreBtn.checked) scrollToTheEnd()
        
        
        lightbox.refresh(); 
        if (photoApiService.downloadedPhotos >= totalAvaliblePhotos) noMorePhorotos()
         })
         .catch(error => {
            try {
            if (error.response.status === 400) {
                noMorePhorotos()
             } console.log(`Something goes 1 wrong + ${error.response.status}`) } catch(error) {console.log(error)} 

            })
         .finally(() => {
           
            refs.loadMore.classList.remove('loading'); 
            if (refs.infiniteScrollBtn.checked) refs.loadMore.classList.add('invisible');
        
         });
}

function noMorePhorotos() {
    refs.loadMore.classList.add('invisible')  
    refs.loadMore.classList.remove('loading');
    window.removeEventListener("scroll", checkPosition)
    window.removeEventListener("resize", checkPosition) 
    refs.error400.classList.remove('invisible')
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
        
            onSearch('infinity scroll')
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


let lightbox = new SimpleLightbox(
    '.gallery a', 
    { 
        overlayOpacity: 0.5, 
        widthRatio: 1.0, 
        heightRatio: 1.0, 
        captionDelay: 250,
    });




