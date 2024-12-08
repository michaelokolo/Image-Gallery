const imageWrapper = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchInput = document.querySelector('.search-box input');

// Pexels API key
const apiKey = 'TYDuclkjPcP9tjSLNZp1Qx8qvGXdHnBj9m0lxoi0nb6QdZ2MWQN6jaI1';

const perPage = 20;
let currentPage = 1;
let searchTerm = 'nature';

const generateHTML = (images) => {
  // Append images to the gallery
  imageWrapper.innerHTML += images
    .map(
      (img) =>
        `<div class="card">
        <img src="${img.src.large}" alt="${img.alt}" loading="lazy" />
        <div class="details">
          <div class="photographer">
            <i class="uil uil-camera"></i>
            <span>${img.photographer}</span>
          </div>
          <button><i class="uil uil-import"></i></button>
        </div>
        <div class="like-collection">
          <button><i class="uil uil-heart-alt"></i></button>
          <button><i class="uil uil-folder-open"></i></button>
        </div>
      </div>`
    )
    .join('');
};

const getImages = (apiURL) => {
  // Fetch images from Pexels API
  loadMoreBtn.innerHTML = 'Loading...';
  loadMoreBtn.classList.add('disabled');
  fetch(apiURL, {
    headers: {
      Authorization: apiKey,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      return response.json();
    })
    .then((data) => {
      if (data.photos && data.photos.length > 0) {
        generateHTML(data.photos);
      } else {
        console.error('No images found');
      }
      loadMoreBtn.innerHTML = 'Load More';
      loadMoreBtn.classList.remove('disabled');
    })
    .catch((error) => {
      console.error('Error fetching images:', error);
      loadMoreBtn.innerHTML = 'Load More';
      loadMoreBtn.classList.remove('disabled');
    });
};

const loadMoreImages = () => {
  // Load more images when the button is clicked
  currentPage++;
  let apiURL = `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&orientation=square&size=large&per_page=${perPage}`;
  getImages(apiURL);
};

getImages(
  `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&orientation=square&size=large&per_page=${perPage}`
);

const loadSearchImages = (e) => {
  // Load images when the user searches for a term
  if (e.key === 'Enter' && searchInput.value !== '') {
    currentPage = 1;
    searchTerm = e.target.value;
    imageWrapper.innerHTML = '';
    getImages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&orientation=square&size=large&per_page=${perPage}`
    );
  }
};

loadMoreBtn.addEventListener('click', loadMoreImages);
searchInput.addEventListener('keyup', loadSearchImages);
