import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '36616291-61cbd7d0a9e765bab834c6c33';

export default class Pictures {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
  }

  async getPictures() {
    const { data } = await axios.get(
      `${URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    );
    this.incrementPage();
    //console.log(data);
    return data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}