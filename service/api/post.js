import axios from 'axios';
import config from '../config';
import { handleRequestError } from '../common';

const { baseURL } = config;

const instance = axios.create({
    baseURL,
    // timeout: 5000, // Set an appropriate timeout value
});

export function index() {
    return instance
        .get('/auth/show/post')
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting Posts'));
}

export function show(id) {
    return instance
        .get(`/auth/single/admin/post/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting Post by ID'));
}

export function create(formData) {
    return instance
        .post('/auth/create/post', formData)
        .then((response) => response.data.data)
        .catch((error) => handleRequestError(error, 'Error creating Post'));
}

export function update(formData) {
    return instance
        .put(`/auth/update/post`,formData)
        .then((response) => response.data.data)
        .catch((error) => handleRequestError(error, 'Error updating Post'));
}

export function destroy(id) {
    return instance
        .delete(`/auth/delete/post/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error deleting Post'));
}
