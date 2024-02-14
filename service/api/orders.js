import axios from 'axios';
import config from '../config';
import { handleRequestError } from '../common';

const { baseURL } = config;

const instance = axios.create({
    baseURL,
    timeout: 5000, // Set an appropriate timeout value
});

export function index(message, userName,dates) {
    return instance
        .get(`/auth/order/filter/count`, { params: { message,userName,dates } })
        .then((response) => response.data)
        .catch((error) => error.message);
}


export function show(id) {
    return instance
        .get(`/auth/order/show/admin/${id}`)
        .then((response) => response.data)
        .catch((error) =>(error))
}

export function showUser() {
    return instance
        .get('/auth/show/customer')
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error creating customer'));
}   

export function updateStatusAdmin({ids,orderStatus,createdAt,trackingId,userId }) {
    return instance
      .put(`/auth/order/status/change`, {ids,orderStatus,createdAt,trackingId,userId})
      .then((response) => response.data)
      .catch((error) => handleRequestError(error, 'Error updating order status'));
}

export function destroy(id) {
    return instance
        .delete(`/auth/order/delete/admin/${id}`)
        .then((response) => response.data)
        .catch((error) =>error)
}

export function multiDestroy(id) {
    return instance
        .delete(`/auth/order/multi/delete/order`,{data:{id}})
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error deleting product'));
}

export function sendNotification({name,email}) {
    console.log(name,email);
    return instance
      .post(`/auth/order/sms/send`,{name,email})
      .then((response) => response.data)
      .catch((error) => handleRequestError(error, 'Error updating order status'));
}

export function showBilling(id) {
    return instance
      .get(`/auth/admin/billing/${id}`)
      .then((response) => response.data)
      .catch((error) => handleRequestError(error, 'Error updating order status'));
}

export function showShipping(id) {
    return instance
      .get(`/auth/admin/shipping/${id}`)
      .then((response) => response.data)
      .catch((error) => handleRequestError(error, 'Error updating order status'));
}

export function updateShipping(data) {
    return instance
      .put(`/auth/admin/update/shipping/${data._id}`,data)
      .then((response) => response.data)
      .catch((error) => handleRequestError(error, 'Error updating order status'));
}


export function updateBilling(data) {
    return instance
      .put(`/auth/admin/update/billing/${data._id}`,data)
      .then((response) => response.data)
      .catch((error) => handleRequestError(error, 'Error updating order status'));
}

export function exportOrder(id) {;
    return instance
      .post(`/auth/export/order/csv`,{ id })
      .then((response) => response.data)
      .catch((error) => handleRequestError(error, 'Error updating order status'));
}

export function updateOrder(data) {
    return instance
      .put(`/auth/order/update/admin`,data)
      .then((response) => response.data)
      .catch((error) => error);
}

export function showUers() {
    return instance
        .get('/auth/show/customer/')
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting customers'));
}

export function applyCoupon(data) {
    return instance 
       .post('/auth/apply/coupon',data)
       .then((response)=>response.data)
       .catch((error)=>error)
}

export function createOrder(data){
    return instance
    .post('/auth/new/order/admin',data)
    .then((response)=>response.data)
    .catch((error)=>error)
}

export function createBilling(data,id){
    return instance
    .post(`/auth/admin/billing/${id}`,data)
    .then((response)=>response.data)
    .catch((error)=>error)
}

export function createShipping(data,id){
    return instance
    .post(`/auth/admin/shipping/${id}`,data)
    .then((response)=>response.data)
    .catch((error)=>error)
}

export function importOrderId(formdata){
    console.log(formdata);
    return instance
    .post('/auth/import/tacking/order',formdata)
    .then((response)=>response.data)
    .catch((error)=>error.message)
}