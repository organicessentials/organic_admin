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
        .get('/auth/show/page')
        .then((response) => response.data.data)
        .catch((error) => handleRequestError(error, 'Error getting categories'));
}

export function show(id) {
    return instance
        .get(`/auth/show/page/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting page by ID'));
}

export function create(categoryData) {
    return instance
        .post('/auth/create/page', categoryData)
        .then((response) => response.data.data)
        .catch((error) => handleRequestError(error, 'Error creating page'));
}

export function update(formData) {
    return instance
        .put(`/auth/update/page/${formData._id}`, formData)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error updating page'));
}

export function destroy(id) {
    return instance
        .delete(`/auth/delete/page/${id}`)
        .then((response) => response.data.data)
        .catch((error) => handleRequestError(error, 'Error deleting page'));
}
