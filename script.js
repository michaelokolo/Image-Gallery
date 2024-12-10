const imageWrapper = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchInput = document.querySelector('.search-box input');
const lightBox = document.querySelector('.lightbox');
const closeBtn = document.querySelector('.uil-times');
const downloadImgBtn = lightBox.querySelector('.uil-import');

// Pexels API key
const apiKey = 'TYDuclkjPcP9tjSLNZp1Qx8qvGXdHnBj9m0lxoi0nb6QdZ2MWQN6jaI1';

const perPage = 20;
let currentPage = 1;
let searchTerm = 'nature';

const downloadImg = (imgUrl) => {
  // Download the image when the user clicks the download button
  fetch(imgUrl)
    .then((response) => response.blob())
    .then((file) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert('Failed to download image'));
};

const likeImg = (icon) => {
  // Change the heart icon when the user likes an image
  if (icon.classList.contains('fa-solid')) {
    icon.classList.remove('fa-solid');
    icon.classList.add('fa-regular');
  } else {
    icon.classList.remove('fa-regular');
    icon.classList.add('fa-solid');
  }
};

const showLightbox = (name, img, alt) => {
  // Show the lightbox when the user clicks on an image
  lightBox.querySelector('img').src = img;
  lightBox.querySelector('img').alt = alt;
  lightBox.querySelector('span').innerText = name;
  downloadImgBtn.setAttribute('data-img', img);
  lightBox.classList.add('show');
  document.body.style.overflow = 'hidden';
};

const hideLightbox = () => {
  lightBox.classList.remove('show');
  document.body.style.overflow = 'auto';
};

const generateHTML = (images) => {
  // Append images to the gallery
  imageWrapper.innerHTML += images
    .map(
      (img) =>
        `<div class="card" onclick="showLightbox('${img.photographer}','${img.src.large}', '${img.alt}')">
        <img src="${img.src.large}" alt="${img.alt}" loading="lazy" />
        <div class="details">
          <div class="photographer">
            <i class="uil uil-camera"></i>
            <span>${img.photographer}</span>
          </div>
          <button onclick=downloadImg("${img.src.large}");event.stopPropagation();>
                <i class="uil uil-import"></i>
            </button>
        </div>
        <div class="like-collection">
          <button><i onclick="likeImg(this); event.stopPropagation();" class="fa-regular fa-heart heart-color"></i></button>
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
  if (e.key === 'Enter') {
    currentPage = 1;
    searchTerm = e.target.value || 'nature';
    imageWrapper.innerHTML = '';
    getImages(
      `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&orientation=square&size=large&per_page=${perPage}`
    );
  }
};

loadMoreBtn.addEventListener('click', loadMoreImages);
searchInput.addEventListener('keyup', loadSearchImages);
closeBtn.addEventListener('click', hideLightbox);
downloadImgBtn.addEventListener('click', (e) =>
  downloadImg(e.target.dataset.img)
);
