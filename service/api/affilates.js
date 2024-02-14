import axios from 'axios';
import config from '../config';
import { handleRequestError } from '../common';

const { baseURL } = config;

const instance = axios.create({
    baseURL,
    timeout: 5000, // Set an appropriate timeout value
});

export function show() {
    return instance
        .get(`/auth/show/affilate/user`)
        .then((response) =>response.data)
        .catch((error) => handleRequestError(error, 'Error getting attribute values'));
}

export function updateAffilateStatus ({ids,status}) {
    return instance
    .put(`/auth/update-status-by-admin`,{ids,status})
    .then((response)=>response.data)
    .catch((error)=>error.message)
}

export function deleteAffilateUser(ids) {
    console.log(ids);
    return instance
      .delete('/auth/delete-status-by-admin', { data: { ids } })
      .then((response) => response.data)
      .catch((error) => error.message);
}

export function deleteAffilateUserSingle (id) {
    return instance
    .delete(`/auth/delete-singal-user/${id}`)
    .then((response)=>response.data)
    .catch((error)=>error.message)
}

export function showVisitsLink () {
    return instance
    .get('/auth/show-visits-links')
    .then((response)=>response.data)
    .catch((error)=>error.message)
}
  
export function showAffiliateUserId (id) {
    return instance
    .get(`/auth/show/affilate-user/${id}`)
    .then((response)=>response.data)
    .catch((error)=>error.message)
}

export function updateAffilateId (data) {
    return instance
    .put('/auth/update-affilate-id',data)
    .then((response)=>response.data)
    .catch((error)=>error.message)
}