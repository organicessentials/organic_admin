import axios from 'axios';
import config from '../config';
import { handleRequestError } from '../common';

const { baseURL } = config;

const instance = axios.create({
    baseURL,
    timeout: 5000, // Set an appropriate timeout value
});

export function index() {
    return instance
        .get('/auth/show/postCategory')
        .then((response) => response.data.data)
        .catch((error) => handleRequestError(error, 'Error getting categories'));
}

export function show(id) {
    return instance
        .get(`/auth/show/postCategory/${id}`)
        .then((response) => response.data.data)
        .catch((error) => handleRequestError(error, 'Error getting category1 by ID'));
}

export function create(categoryData) {
    return instance
        .post('/auth/create/postCategory', categoryData)
        .then((response) => response.data.data)
        .catch((error) => handleRequestError(error, 'Error creating category1'));
}

export function update(id, categoryData) {
    return instance
        .put(`/auth/update/postCategory/${id}`, categoryData)
        .then((response) => response.data.data)
        .catch((error) => handleRequestError(error, 'Error updating category1'));
}

export function destroy(id) {
    return instance
        .delete(`/auth/delete/postCategory/${id}`)
        .then((response) => response.data.data)
        .catch((error) => handleRequestError(error, 'Error deleting category1'));
}
