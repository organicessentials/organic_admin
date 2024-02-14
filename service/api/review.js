import axios from 'axios';
import config from '../config';
import { handleRequestError } from '../common';

const { baseURL } = config;

const instance = axios.create({
    baseURL,
    timeout: 5000, // Set an appropriate timeout value
});

export function showComments() {
    return instance
        .get('/auth/show/admin/comments')
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting product'));
}


export function updateComments(newData) {
    return instance
        .put(`/auth/update/comment/${newData.id}`,newData)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting product'));
}



export function deleteComments(id) {
    console.log(id);
    return instance
        .delete(`/auth/delete/comment/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting product'));
}