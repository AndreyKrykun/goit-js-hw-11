import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { createGalleryMarkup } from './js/createImagesMarkup';
import { fetchImages } from './js/fetchImages';
import { createGallery } from './js/createGallary';

const refs = {
    form: document.querySelector('#search-form'),
    searchImageText: document.querySelector('[name="searchQuery"]'),
    loadMoreBtn: document.querySelector('.load-more'),
    gallery: document.querySelector('.gallery'),
};

const fetchOptions = {
imagePerPage: 40,
currentPage: 1,
searchText: "",
};

const lightbox = new SimpleLightbox('.gallery a', { captionsData: 'alt' , captionDelay: '250'});

let totalCards = 0;

const observerOptions = {
    rootMargin: '350px',
    threshold: 1.0
};
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (fetchOptions.currentPage * fetchOptions.imagePerPage >= totalCards) {
                Notify.warning("We're sorry, but you've reached the END of search results.");
                return;
            }
            onLoadMore();
        };
    });
}, observerOptions);

refs.form.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

 async function onSearch(event) {
    try {
        event.preventDefault();

        fetchOptions.searchText = event.target.elements.searchQuery.value;
        if(!fetchOptions.searchText) {
            Notify.failure('Sorry, there are Empty field. Please try again.');
            return;
        }
        resetValues();

        const fetchData = await fetchImages(fetchOptions);
        await drawGallery(fetchData);
    } catch(error) {
        Notify.failure(error);
    }
};

function resetValues() {
    refs.gallery.innerHTML = '';
    fetchOptions.currentPage = 1;
    setObserverOff();
}

async function onLoadMore() {
    try {
        fetchOptions.currentPage += 1;

        const fetchData = await fetchImages(fetchOptions);
        await drawGallery(fetchData);
    } catch (error) {
        Notify.failure(error);
    };
}

function setObserverOn() {
    observer.observe(document.querySelector('.scroll-check'));
};

function setObserverOff() {
    observer.unobserve(document.querySelector('.scroll-check'));
};

function drawGallery(data) {
    const cards = data.hits;
    totalCards = data.totalHits;

    if (!totalCards) {
        Notify.failure('Sorry, there are NO IMAGES matching your search query. Please try again.');
        
        refs.form.reset();
        return;
    };

    if (fetchOptions.currentPage === 1) {
        Notify.success(`Hooray! We found ${totalCards} images.`);
    };

    createGallery(refs.gallery, cards);

    lightbox.refresh();

    setObserverOn();
};
