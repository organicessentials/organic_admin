import axios from 'axios';
import config from '../config';
import { handleRequestError } from '../common';

const { baseURL } = config;

const instance = axios.create({
    baseURL,
    timeout: 5000, // Set an appropriate timeout value
});

export function showPayoutRefferals() {
    return instance
        .get(`/auth/show-payout-links`)
        .then((response) =>response.data)
        .catch((error) => handleRequestError(error, 'Error getting attribute values'));
}

export function showIdData (id) {
    return instance
    .get(`/auth/show-payout-links/${id}`)
    .then((response) =>response.data)
    .catch((error) => handleRequestError(error, 'Error getting attribute values'));
}

export function deletePayoutId ({ids}) {
    return instance
    .post(`/auth/delete-multi-referrals`,{ids})
    .then((response) =>response.data)
    .catch((error) => handleRequestError(error, 'Error getting attribute values'));
}