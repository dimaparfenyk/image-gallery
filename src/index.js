import { Notify } from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import  API  from "./js/apiService";
import LoadMoreButton from "./js/components";

const form=document.querySelector('.search-form');
const container=document.querySelector('.gallery');

const api= new API();
const loadMoreBtn = new LoadMoreButton({selector:'.load-more', hidden: true,});

form.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

async function onLoadMore(e){
try {
    loadMoreBtn.disable();
    await  api.fetchImages()
       .then(({hits,totalHits})=>{

        const totalImagesAmmount=api.per_page*api.page;

        if(totalHits<totalImagesAmmount){
            hideLoadMoreButtonAtCollectionEnd();
        }
           appendGalleryMarkup(hits); 
           api.incrementPage();
           loadMoreBtn.enable();
           smoothScrollingPage();
           Notify.success(`Hooray! We found ${hits.length} more images.`)
        //    инициализация библиотеки для просмотра изображений
       const gallery=new SimpleLightbox('.gallery a',{captionsData: 'alt',animationSpeed:250});
       gallery.refresh();
       }) 
        } catch (error) {  
        console.log(error);   
} 
}

async function onSearch(e){
    e.preventDefault();

    const form=e.currentTarget;
    const searchQuery=form.elements.searchQuery.value;

    if(searchQuery===''){
        Notify.failure('Oops! Type something, please!');
        return;
    };
    api.query=searchQuery.trim();

    api.resetPage();
    loadMoreBtn.show();
    loadMoreBtn.disable();

    await api.fetchImages()
    .then(({hits, totalHits})=>{
        if(!totalHits){
          Notify.failure("Sorry, there are no images matching your search query. Please try again.");
          clearGalleryMarkup();
          loadMoreBtn.hide();
          return;
        };

        if(hits.length<api.per_page){
            hideLoadMoreButtonAtCollectionEnd();
        }
        // Rendering
        clearGalleryMarkup();
        appendGalleryMarkup(hits);
        // smoothScrollingPage();
        Notify.success(`Hooray! We found ${hits.length} images.`)
        new SimpleLightbox('.gallery a',{captionsData: 'alt',animationSpeed:250});
        // Increment page for next fetch
        api.incrementPage();
        // Logic of buttons UI
        loadMoreBtn.enable();

        console.dir(document
            .querySelector(".gallery")
            .firstElementChild.getBoundingClientRect())
    })
        form.reset();
};

function renderImgMarkup(items){
return items.map(({webformatURL, largeImageURL, tags, likes,views,comments,downloads})=>
    `<div class="photo-card">
    <a href="${largeImageURL}">
    <img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a> 
    <div class="info">
      <p class="info-item"> Likes: ${likes}</p>
      <p class="info-item"> Views: ${views}</p>
      <p class="info-item"> Comments: ${comments}</p>
      <p class="info-item"> Downloads: ${downloads}</p>
    </div>
  </div>`
).join('');
};

function appendGalleryMarkup(items) {
   container.insertAdjacentHTML('beforeend', renderImgMarkup(items))
};

function clearGalleryMarkup(){
    container.innerHTML='';
};

function hideLoadMoreButtonAtCollectionEnd(){
    loadMoreBtn.hide();
    Notify.info(`We're sorry, but you've reached the end of search results.`);
};

function smoothScrollingPage(){
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();
 
window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}


