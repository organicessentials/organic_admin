import axios from 'axios';
import config from '../config';
import { handleRequestError } from '../common';

const { baseURL } = config;

const instance = axios.create({
    baseURL,
    timeout: 5000, // Set an appropriate timeout value
});

export function showProduct() {
    return instance
        .get('/auth/show/products')
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting product'));
}


export function updateProduct(updatedArray) {
    return instance
        .put('/auth/update/all',updatedArray)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting product'));
}



export function deleteComments(id) {
    return instance
        .delete(`/auth/delete/comment/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting product'));
}