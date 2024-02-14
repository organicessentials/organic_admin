import axios from 'axios';
import config from '../config';
import { handleRequestError } from '../common';

const { baseURL } = config;

const instance = axios.create({
    baseURL,
    timeout: 5000, // Set an appropriate timeout value
});

export function adminLogin(email,password) {
    return instance
        .post(`/auth/login-admin`,{email:email,password:password})
        .then((response) =>response.data)
        .catch((error) => handleRequestError(error, 'Error getting attribute values'));
}

export function resetPasswordApi(email){
    return instance
    .put('/auth/reset-user-password',{email})
    .then((response)=>response.data)
    .catch((error) => handleRequestError(error, 'Error getting attribute values'));
}