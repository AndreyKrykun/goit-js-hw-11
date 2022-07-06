import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';

const API_KEY = '28335848-011b3dc949dd802b31558b1f8';

export async function fetchImages(
    { searchText, currentPage, imagePerPage}) { 
    
    try {
        const config = {
            params: {
                key: API_KEY,
                q: searchText,
                image_type: 'photo',
                orientation: 'horizontal',
                safesearch: true,
                page: currentPage,
                per_page: imagePerPage,
            },
        };

        const response = await axios.get('', config);
        return response.data;
    } catch (error) {
        Notify.failure(error);
    };
}