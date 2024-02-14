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
        .get('/auth/show/coupons')
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting customers'));
}

export function show(id) {
    return instance
        .get(`/auth/singal/coupon/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting customer by ID'));
}

export function create(formData) {
    return instance
        .post('/auth/create/coupon', formData)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error creating customer'));
}

export function update(formData) {
    console.log(formData);
    return instance
        .put(`/auth/update/coupon/${formData._id}`,formData)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error updating customer'));
}

export function destroy(id) {
    return instance
        .delete(`/auth/singal/coupon/delete/${id}`)
        .then((response) => response.data.data)
        .catch((error) => handleRequestError(error, 'Error deleting customer'));
}

export function multiDestroy(id) {
    console.log(id);
    return instance
        .delete(`/auth/delete/multi/coupon`,{data:{id}})
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error deleting product'));
}
