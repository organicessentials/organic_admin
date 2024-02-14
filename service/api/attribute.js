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
        .get('/auth/show/attribute')
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting attributes'));
}

export function show(id) {
    return instance
        .get(`/auth/show/attribute/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting attribute by ID'));
}

export function create(categoryData) {
    return instance
        .post('/auth/create/attribute', categoryData)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error creating attribute'));
}

export function update(id, categoryData) {
    return instance
        .put(`/auth/update/attribute/${id}`, categoryData)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error updating attribute'));
}

export function destroy(id) {
    return instance
        .delete(`/auth/delete/attribute/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error deleting attribute'));
}


export function indexValue(id) {
    return instance
        .get(`/auth/show/attribute/val/${id}`)
        .then((response) => response.data.attributeValue)
        .catch((error) => handleRequestError(error, 'Error getting attribute values'));
}

export function showValue(id) {
    return instance
        .get(`/auth/show/attribute/val/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting attribute value by ID'));
}

export function createValue(data) {
    return instance
        .post(`/auth/create/attribute/val/${data.id}`,{name:data.name})
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error creating attribute value'));
}

export function updateValue(data) {
    console.log(data);
    return instance
        .post(`/auth/update/attribute/val/${data.id}`,data)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error updating attribute value'));
}

export function destroyValue({id,valId}) {
    console.log(id,valId);
    return instance
        .delete(`auth/delete/attribute/val/${id}`,{data:{valId}})
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error deleting attribute value'));
}
