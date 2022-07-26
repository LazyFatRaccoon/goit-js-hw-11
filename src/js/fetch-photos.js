import {refs} from './refs';
const axios = require('axios').default;

export {PhotoApiService};

const PIXABAY_API = '28779576-100bff5fe30acba8bf909e20d';
const BASE_URL='https://pixabay.com/api/';

class PhotoApiService {
    constructor() {
        this.downloadedPhotos = 0;
        this.searchQuery = '';
        this.page = 1;
    }
    async fetchPhotos(perPage) {
        console.log('This time will be loaded', perPage, 'photos. Already loaded -', this.downloadedPhotos)
        const url = `${BASE_URL}?key=${PIXABAY_API}&q=${this.searchQuery}&image_type=photo&per_page=${perPage}&page=${this.page}`;
        this.incrementPage();
        return await axios.get(url);
    }


    incrementPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }

    increaseDownloadedPhotosCount(photosCount) {
        this.downloadedPhotos += photosCount;
    }

    resetDownloadedPhotosCount() {
        this.downloadedPhotos = 0;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
    get query() {
        return this.query;
    }

    set downloaded(newDownloadedPhotos) {
        this.downloadedPhotos = newDownloadedPhotos;
    }

    get downloaded() {
        return this.downloadedPhotos;
    }
    
    
}




