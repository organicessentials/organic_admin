import axios from 'axios';
import config from '../config';
import { handleRequestError } from '../common';

const { baseURL } = config;

const instance = axios.create({
    baseURL,
    timeout: 5000, // Set an appropriate timeout value
});

export function userCount() {
    return instance
        .get('/auth/show/customer/')
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting customers'));
}

export function index() {
    return instance
        .get('/auth/show/customer/')
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting customers'));
}

export function show(id) {
    console.log(id);
    return instance
        .get(`/auth/singal/customer/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting customer by ID'));
}

export function create(categoryData) {
    return instance
        .post('/auth/create/custmer', categoryData)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error creating customer'));
}

export function update(formData) {
    console.log(formData);
    return instance
        .put(`/auth/update/customer/${formData._id}`,formData)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error updating customer'));
}

export function destroy(id) {
    return instance
        .delete(`/auth/delete/customer/${id}`)
        .then((response) => response.data.data)
        .catch((error) => handleRequestError(error, 'Error deleting customer'));
}
