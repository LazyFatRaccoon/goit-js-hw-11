export {cardMarkUp};
function cardMarkUp(photo) {
   let {comments, downloads, likes, views, tags, largeImageURL, webformatURL} = photo;


  return `<div class="photo-card">
            <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" data-source="${largeImageURL}"/>
            </a>
            <div class="info">
                <p class="info-item">
                    <b>Likes</b>
                    <br>
                    ${convertToInternationalCurrencySystem(likes)}
                </p>
                <p class="info-item">
                    <b>Views</b>
                    <br>
                    ${convertToInternationalCurrencySystem(views)}
                </p>
                <p class="info-item">
                    <b>Comments</b>
                    <br>
                    ${convertToInternationalCurrencySystem(comments)}
                </p>
                <p class="info-item">
                    <b>Downloads</b>
                    <br>
                    ${convertToInternationalCurrencySystem(downloads)}
                </p>
            </div>
            
        </div>`}


        function convertToInternationalCurrencySystem (labelValue) {

            // Nine Zeroes for Billions
            return Math.abs(Number(labelValue)) >= 1.0e+9
        
            ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(1) + " B"
            // Six Zeroes for Millions 
            : Math.abs(Number(labelValue)) >= 1.0e+6
        
            ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(1) + " M"
            // Three Zeroes for Thousands
            : Math.abs(Number(labelValue)) >= 1.0e+3
        
            ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(1) + " K"
        
            : Math.abs(Number(labelValue));
        
        }