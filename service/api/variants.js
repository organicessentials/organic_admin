import axios from 'axios';
import config from '../config';
import { handleRequestError } from '../common';

const { baseURL } = config;

const instance = axios.create({
    baseURL,
    timeout: 5000, // Set an appropriate timeout value
});

export function showAttribute() {
    return instance
        .get(`/auth/show/attribute`)
        .then((response) =>(response.data))
        .catch((error) => handleRequestError(error, 'Error creating product'));
}

export function showAttributeValue() {
    return instance
        .get(`/auth/show/attributeValue`)
        .then((response) =>(response.data))
        .catch((error) => handleRequestError(error, 'Error creating product'));
}

export function createVarinat(data) {
    return instance
        .post(`/auth/add/variant`,data)
        .then((response) =>(response.data))
        .catch((error) => handleRequestError(error, 'Error creating product'));
}
export function showVarinats(id) {
    return instance
        .get(`/auth/show/variant/${id}`)
        .then((response) =>(response.data))
        .catch((error) => handleRequestError(error, 'Error creating product'));
}
export function updateVariants(newData) {
    console.log(newData);
    return instance
        .put(`/auth/update/variant/${newData._id}`,newData)
        .then((response) =>(response.data))
        .catch((error) => handleRequestError(error, 'Error creating product'));
}