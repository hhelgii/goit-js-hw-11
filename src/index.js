import Notiflix from 'notiflix';
import Pictures from './Pictures.js';
import LoadBtn from './components/loadBtn.js';
const refs = {
  form: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more'),
};
const pictures = new Pictures();
const loadBtn = new LoadBtn({
  selector: '#load-more',
  isHidden: true,
});
refs.form.addEventListener('submit', onSubmit);
loadBtn.button.addEventListener('click', fetchPictures);

function onSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const value = form.elements.searchQuery.value.trim();

  if (value === '') Notiflix.Notify.failure('Input valid search query!');
  else {
    console.log(value);
    pictures.searchQuery = value;
    pictures.resetPage();
    loadBtn.show();
    clearGallery();
    fetchPictures().finally(() => form.reset());
  }
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}
async function fetchPictures() {
  loadBtn.disable();
  try {
    const markup = await getMarkup();
    if (!markup) throw new Error('No data');
    updateMarkup(markup);
  } catch (error) {
    onError(error);
  }
  loadBtn.enable();
}
async function getMarkup() {
  try {
    const pics = await pictures.getPictures();
    if (!pics) {
      loadBtn.hide();
      return '';
    }
    if (pics.length === 0) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      throw new Error('No data');
    }
    return pics.reduce((markup, pic) => markup + createmarkup(pic), '');
  } catch (error) {
    onError(error);
  }
}
function createmarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${downloads}</b>
      </p>
    </div>
  </div>`;
}
function updateMarkup(markup) {
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}
function onError(error) {
  console.log(error);
  loadBtn.hide();
  refs.gallery.innerHTML = 'ERROR!';
}
