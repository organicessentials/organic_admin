import axios from 'axios';
import config from '../config';
import { handleRequestError } from '../common';

const { baseURL } = config;

const instance = axios.create({
    baseURL,
    timeout: 5000, // Set an appropriate timeout value
});

export function show(message) {
    return instance
        .get(`/auth/show-creatives-list`,{ params: { message } })
        .then((response) =>response.data)
        .catch((error) => handleRequestError(error, 'Error getting attribute values'));
}


export function createCreative(data){
    return instance
    .post('/auth/create-creatives',data)
    .then((response)=>response.data)
    .catch((error)=>error.message)
}

export function showIdData(id) {
    console.log(id);
    return instance
        .get(`/auth/show-creatives/${id}`)
        .then((response) =>response.data)
        .catch((error) => handleRequestError(error.message));
}

export function creativeIdDelete(id) {
    return instance
        .delete(`/auth/delete-creatives/${id}`)
        .then((response) =>response.data)
        .catch((error) => handleRequestError(error.message));
}


export function updateCreativeData(formData) {
    return instance
        .put(`/auth/update-creatives/`,formData)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error updating product'));
}

export function multiStatusUpdate ({ids,selectStatus}) {
    return instance
    .put('/auth/multi-status-change',{ids,selectStatus})
    .then((response) =>response.data)
    .catch((error) => handleRequestError(error, 'Error updating product'));
}

export function multiCreativeDelete ({ids}) {
    return instance
    .delete('/auth/multi-delete-ids',{ data: { ids } })
    .then((response) =>response.data)
    .catch((error) => handleRequestError(error, 'Error updating product'));
}