import {refs} from './refs.js';
import { cardMarkUp } from './card_markUp.js';
export {calcPhotosOnPage, scrollToTheEnd, paintMarkUp};

function cssVar(name, value){
    if(name[0]!='-') name = '--'+name //allow passing with or without --
    if(value) document.documentElement.style.setProperty(name, value)
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}

function calcPhotosOnPage() {
    let width = parseInt((window.innerWidth < 1200 ? cssVar('--photoSmallWidth') : cssVar('--photoLargeWidth')).trim());
    let height = parseInt((window.innerWidth < 1200 ? cssVar('--photoSmallHeight') : cssVar('--photoLargeHeight')).trim());

    let gap = parseInt((window.getComputedStyle(refs.gallery).gap).trim()) 
    let paddingsX =  parseInt((window.getComputedStyle(refs.gallery).paddingLeft).trim()) + parseInt((window.getComputedStyle(refs.gallery).paddingRight).trim())
    let paddingsY =  parseInt((window.getComputedStyle(refs.gallery).paddingBottom).trim()) + parseInt((window.getComputedStyle(refs.gallery).paddingTop).trim())
    let countX = Math.floor((window.innerWidth - paddingsX) / (width + gap))
    let searchPannelY = parseInt((window.getComputedStyle(refs.searchBar).height).trim())
    
    countX = ((countX+1) * (width + gap)) - gap + paddingsX <= window.innerWidth ? countX+1 : countX;
    let countY = Math.floor((window.innerHeight - paddingsY - searchPannelY) / (height + gap))
    countY = ((countY+1) * (height + gap)) - gap + paddingsY + searchPannelY <= window.innerHeight ? countY+1 : countY;
    return countX*countY;
}

function scrollToTheEnd() {
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .getBoundingClientRect();
        
            window.scrollBy({
                top: cardHeight,
                behavior: "smooth",
              });
}

function paintMarkUp(data) {
    let {hits: photos} = data.data;
    let totalMarkUp = '';
    for (let photo of photos) {
        totalMarkUp += cardMarkUp(photo)
    } 
    refs.gallery.insertAdjacentHTML('beforeend', totalMarkUp)
}