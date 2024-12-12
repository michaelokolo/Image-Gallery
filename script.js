// Purpose: This file contains the JavaScript code for the image gallery.
const imageWrapper = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const searchInput = document.querySelector('.search-box input');
const lightBox = document.querySelector('.lightbox');
const closeBtn = document.querySelector('.uil-times');
const downloadImgBtn = lightBox.querySelector('.uil-import');
const likeBtn = lightBox.querySelector('.fa-heart');
const year = document.querySelector('.footer-copyright span');
const hamburgerMenu = document.querySelector('.hamburger-menu');
const navLinks = document.getElementById('primary-navigation');
const darkModeToggle = document.querySelector('.dark-mode-toggle');

hamburgerMenu.addEventListener('click', () => {
  // Toggle the menu when the user clicks the hamburger menu
  const isExpanded = hamburgerMenu.getAttribute('aria-expanded') === 'true';
  hamburgerMenu.setAttribute('aria-expanded', !isExpanded);
  navLinks.classList.toggle('open');
});

// Update the year in the footer
const date = new Date();
year.innerText = date.getFullYear();

// Store liked images
const likedImages = new Set();

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

const toggleDarkMode = () => {
  // Toggle dark mode
  const body = document.body;
  body.classList.toggle('dark');
  if (body.classList.contains('dark')) {
    darkModeToggle.querySelector('i').classList.remove('fa-moon');
    darkModeToggle.querySelector('i').classList.add('fa-sun');
  } else {
    darkModeToggle.querySelector('i').classList.remove('fa-sun');
    darkModeToggle.querySelector('i').classList.add('fa-moon');
  }
};

const likeImg = (icon, id) => {
  // Change the heart icon when the user likes an image
  const stringId = String(id);

  // If the image is already liked, unlike it
  if (likedImages.has(stringId)) {
    icon.classList.remove('fa-solid');
    icon.classList.add('fa-regular');
    likedImages.delete(stringId);
  } else {
    icon.classList.remove('fa-regular');
    icon.classList.add('fa-solid');
    likedImages.add(stringId);
  }

  updateLikeState(stringId);
};

const updateLikeState = (id) => {
  const stringId = String(id);

  // Update the like state of the gallery icon
  const galleryIcon = document.querySelector(
    `.gallery .fa-heart[data-id="${stringId}"]`
  );

  if (galleryIcon) {
    if (likedImages.has(stringId)) {
      galleryIcon.classList.remove('fa-regular');
      galleryIcon.classList.add('fa-solid');
    } else {
      galleryIcon.classList.remove('fa-solid');
      galleryIcon.classList.add('fa-regular');
    }
  }

  // Update the like state of the lightbox icon
  if (lightBox.classList.contains('show')) {
    const lightboxIcon = lightBox.querySelector('.fa-heart');
    if (lightboxIcon && lightboxIcon.getAttribute('data-id') === stringId) {
      if (likedImages.has(stringId)) {
        lightboxIcon.classList.remove('fa-regular');
        lightboxIcon.classList.add('fa-solid');
      } else {
        lightboxIcon.classList.remove('fa-solid');
        lightboxIcon.classList.add('fa-regular');
      }
    }
  }
};

const showLightbox = (name, img, alt, id) => {
  // Show the lightbox when the user clicks on an image
  lightBox.querySelector('img').src = img;
  lightBox.querySelector('img').alt = alt;
  lightBox.querySelector('span').innerText = name;
  downloadImgBtn.setAttribute('data-img', img);
  likeBtn.setAttribute('data-id', id);

  if (likedImages.has(id)) {
    likeBtn.classList.remove('fa-regular');
    likeBtn.classList.add('fa-solid');
  } else {
    likeBtn.classList.remove('fa-solid');
    likeBtn.classList.add('fa-regular');
  }

  lightBox.classList.add('show');
  document.body.style.overflow = 'hidden';
};

const hideLightbox = () => {
  lightBox.classList.remove('show');
  document.body.style.overflow = 'auto';
};

document.addEventListener('keydown', function (event) {
  if (event.key === 'Escape' || event.keyCode === 27) {
    hideLightbox();
  }
});

const generateHTML = (images) => {
  // Append images to the gallery
  imageWrapper.innerHTML += images
    .map(
      (img) =>
        `<div class="card" role="button" tabindex="0" aria-label="View image by ${img.photographer}" onclick="showLightbox('${img.photographer}','${img.src.large}', '${img.alt}', '${img.id}')">
        <img src="${img.src.large}" alt="${img.alt}" loading="lazy" />
        <div class="details">
          <div class="photographer">
            <i class="uil uil-camera" aria-hidden="true"></i>
            <span>${img.photographer}</span>
          </div>
          <button aria-label="Download image" onclick=downloadImg("${img.src.large}");event.stopPropagation();>
                <i class="uil uil-import" aria-hidden="true"></i>
            </button>
        </div>
        <div class="like-collection">
          <button aria-label="Like image"><i onclick="likeImg(this,${img.id}); event.stopPropagation();" data-id="${img.id}" class="fa-regular fa-heart" aria-hidden="true"></i></button>
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

// Event listeners
loadMoreBtn.addEventListener('click', loadMoreImages);
searchInput.addEventListener('keyup', loadSearchImages);
closeBtn.addEventListener('click', hideLightbox);
downloadImgBtn.addEventListener('click', (e) =>
  downloadImg(e.target.dataset.img)
);

likeBtn.addEventListener('click', (e) => {
  const id = e.target.getAttribute('data-id');
  likeImg(likeBtn, id);
});
darkModeToggle.addEventListener('click', toggleDarkMode);

document.addEventListener('DOMContentLoaded', () => {
  // Lazy load images
  const observerOptions = {
    root: null,
    threshold: 0.1,
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  const observeCards = () => {
    const cards = document.querySelectorAll('.card:not(.observed)');
    cards.forEach((card) => {
      card.classList.add('observed');
      observer.observe(card);
    });
  };

  observeCards();

  const mutationObserver = new MutationObserver(() => {
    observeCards();
  });

  mutationObserver.observe(document.querySelector('.gallery'), {
    childList: true,
    subtree: false,
  });
});
