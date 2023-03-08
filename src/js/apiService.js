const API_KEY = '27652237-fecf1e648e251b2f1d2bb2568';
const BASE_URL='https://pixabay.com/api/';

export default class ApiService{
    constructor(){
        this.searchQuery='';
        this.page=1;
        this.per_page=40;
    }

    async fetchImages(){
        const url=`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.per_page}&page=${this.page}`;
        
        const res = await fetch(url);
        if(res.ok){
          return await res.json();
        }
          }

          get query(){
          return  this.searchQuery;
          }

          set query(newQuery){
            this.searchQuery=newQuery;
          }

          incrementPage(){
            this.page+=1;
          }

          resetPage(){
            this.page=1;
          }
}

