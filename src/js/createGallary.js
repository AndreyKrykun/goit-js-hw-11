import { createGalleryMarkup } from "./createImagesMarkup";

export function createGallery(gallery, cards) {
    gallery.insertAdjacentHTML('beforeend', createGalleryMarkup(cards));
};