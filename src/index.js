import Notiflix from "notiflix";
import axios from "axios";

const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreBtn = document.getElementById('load-more');
let page = 1;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const searchQuery = form.elements['searchQuery'].value.trim();
  if (searchQuery === '') {
    Notiflix.Notify.Failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }
  page = 1;
  gallery.innerHTML = '';
  await fetchImages(searchQuery);
});

async function fetchImages(searchQuery) {
  const apiKey = '42544171-da249f8d1cbbc0c974f44b32c';
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

  try {
    const response = await axios.get(url);
    const { data } = response;
    const { hits, totalHits } = data;
    if (hits.length === 0) {
      Notiflix.Notify.Failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }
    hits.forEach(image => {
      const card = createPhotoCard(image);
      gallery.appendChild(card);
    });
    if (totalHits > page * 40) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    Notiflix.Notify.Failure('Oops! Something went wrong. Please try again.');
  }
}

loadMoreBtn.addEventListener('click', async () => {
  page++;
  const searchQuery = form.elements['searchQuery'].value.trim();
  await fetchImages(searchQuery);
});

function createPhotoCard(image) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const img = document.createElement('img');
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = 'lazy';
  card.appendChild(img);

  const info = document.createElement('div');
  info.classList.add('info');

  const likes = document.createElement('p');
  likes.classList.add('info-item');
  likes.innerHTML = `<b>Likes:</b> ${image.likes}`;
  info.appendChild(likes);

  const views = document.createElement('p');
  views.classList.add('info-item');
  views.innerHTML = `<b>Views:</b> ${image.views}`;
  info.appendChild(views);

  const comments = document.createElement('p');
  comments.classList.add('info-item');
  comments.innerHTML = `<b>Comments:</b> ${image.comments}`;
  info.appendChild(comments);

  const downloads = document.createElement('p');
  downloads.classList.add('info-item');
  downloads.innerHTML = `<b>Downloads:</b> ${image.downloads}`;
  info.appendChild(downloads);

  card.appendChild(info);

  return card; 
}

