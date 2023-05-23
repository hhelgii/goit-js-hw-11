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
  selector: '.load-more',
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
    // pictures
    //   .getPictures()
    //   .then(pics => {
    //     if (pics.totalHits === 0) {
    //       loadBtn.hide();
    //       Notiflix.Notify.failure(
    //         'Sorry, there are no images matching your search query. Please try again.'
    //       );
    //       throw new Error('No data in onSubmit');
    //     }
    //     fetchPictures();
    //   })
    //   .finally(() => form.reset());
    fetchPictures();
    form.reset();
  }
}
function clearGallery() {
  refs.gallery.innerHTML = '';
}
async function fetchPictures() {
  loadBtn.disable();
  try {
    const markup = await getMarkup();
    if (!markup) throw new Error('No data in fetchPictures');
    updateMarkup(markup);
  } catch (error) {
    onError(error);
  }
  loadBtn.enable();
}
async function getMarkup() {
  try {
    const pics = await pictures.getPictures();
    console.log('pictures', pics);

    if (pics.totalHits === 0) {
      loadBtn.hide();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      throw new Error('No data in onSubmit');
    }
    // if (pics.hits.length === 0) {
    //   loadBtn.hide();
    //   Notiflix.Notify.info(
    //     "We're sorry, but you've reached the end of search results."
    //   );
    // }
    if (pics.hits.length < 40) {
      loadBtn.hide();

      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    return pics.hits.reduce((markup, pic) => markup + createmarkup(pic), '');
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
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300"/>
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
  //refs.gallery.innerHTML = 'ERROR!';
}
