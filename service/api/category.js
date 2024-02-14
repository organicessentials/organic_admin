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
        .get('/auth/show/category')
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting categories'));
}

export function show(id) {
    return instance
        .get(`/auth/show/category/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting category by ID'));
}

export function create(categoryData) {
    return instance
        .post('/auth/create/category', categoryData)
        .then((response) => response.data.data)
        .catch((error) => handleRequestError(error, 'Error creating category'));
}

export function update(id, categoryData) {
    return instance
        .put(`/auth/update/category/${id}`, categoryData)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error updating category'));
}

export function destroy(id) {
    return instance
        .delete(`/auth/delete/category/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error deleting category'));
}
