import axios from 'axios';
import config from '../config';
import { handleRequestError } from '../common';

const { baseURL } = config;

const instance = axios.create({
    baseURL,
    timeout: 5000, // Set an appropriate timeout value
});

export function showReferralsLinks(message,userName) {
    console.log(message);
    return instance
        .get('/auth/show-referrals-links',{ params: { message,userName } })
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting product'));
}

export function deleteReferralsLink(id) {
    return instance
        .post(`/auth/delete-refferals-link/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting product'));
}

export function updateReferralsLink({id,status,amount,description}) {
    return instance
        .post(`/auth/update-referrals-link/${id}`,{status,amount,description})
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting product'));
}

export function updateReferralsAllStatus({ids,status}) {
    return instance
        .post(`/auth/update-all-status-referrals`,{status,ids})
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting product'));
}
export function deleteReferralsAll({ids}) {
    return instance
        .post(`/auth/delete-multi-referrals`,{ids})
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting product'));
}
export function showAffiliateUser () {
    return instance
    .get('/auth/show/affilate/user')
    .then((response) => response.data)
    .catch((error) => handleRequestError(error, 'Error getting product'));
}

export function addRefferal ({email,description,status,userId,date,amount}) {
    return instance
    .post('/auth/add-refferal',{email,description,status,userId,date,amount})
    .then((response) => response.data)
    .catch((error) => handleRequestError(error, 'Error getting product'));
} 