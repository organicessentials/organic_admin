import axios from 'axios';
import config from '../config';
import { handleRequestError } from '../common';

const { baseURL } = config;

const instance = axios.create({
    baseURL,
    timeout: 5000, // Set an appropriate timeout value
});

export function index({id,name}) {
    return instance
        .get(`/auth/show/attribute/val/${id}`,name)
        .then((response) =>response.data)
        .catch((error) => handleRequestError(error, 'Error getting attribute values'));
}

// export function show(id) {
//     return instance
//         .get(`/auth/show/attribute/val/${id}`)
//         .then((response) => response.data)
//         .catch((error) => handleRequestError(error, 'Error getting attribute value by ID'));
// }

export function create({id,name,value}) {
    console.log(id,name,value);
    return instance
        .post(`/auth/create/attribute/value/${id}`,{name,value})
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error creating attribute value'));
}

// export function update(data) {
//     console.log(data);
//     return instance
//         .put('/auth/update/attribute/value',data)
//         .then((response) => response.data)
//         .catch((error) => handleRequestError(error, 'Error updating attribute value'));
// }

export function destroy(data) {
    console.log(data);
    return instance
        .post(`/auth/delete/attribute/value/${data.id}`,data)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error deleting attribute value'));
}
