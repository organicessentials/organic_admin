import axios from 'axios';
import config from '../config';
import { handleRequestError } from '../common';

const { baseURL } = config;

const instance = axios.create({
    baseURL,
    // timeout: 5000, 
});

export function index() {
    return instance
        .get('/auth/show/products')
        .then((response) =>(response.data))
        .catch((error) => handleRequestError(error, 'Error getting product'));
}

export function show(id) {
    return instance
        .get(`/auth/show/admin/product/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error getting product by ID'));
}

export function create(categoryData) {
    return instance
        .postForm('/auth/add/product', categoryData)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error creating product'));
}

export function createVarinats(attributeValue,ingredients,formData) {
    const data = {
        variant: attributeValue.attributeValue[0].name,
        value: ingredients.ingredients.name,
        productId: formData._id,
      };
      console.log(data);
    return instance
        .post('/auth/add/variant',data)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error creating product'));
        
}



export function createEssay(formData) {
    return instance
        .post('/auth/add/product',formData)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error creating product'));
}

export function update(formData) {
    console.log(formData);
    return instance
        .put(`/auth/update/product/`,formData)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error updating product'));
}

export function destroy(id) {
    console.log(id);
    return instance
        .delete(`/auth/delete/product/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error deleting product'));
}


export function multiDestroy(productIds) {
    console.log(productIds);
    console.log(productIds);
    return instance
        .delete(`/auth/delete/multi/product`,{data:{productIds}})
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error deleting product'));
}

export function exportProducts() {
    return instance
        .get(`/auth/export/products`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error deleting product'));
}

export function importProducts(formdata) {
    console.log(formdata);
    return instance
        .post(`/auth/import/products`,formdata)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error deleting product'));
}

export function deleteVariant(id) {
    console.log(id);
    return instance
        .delete(`/auth/product/delete/varainat/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error deleting product'));
}

export function showVariant(id) {
    console.log(id);
    return instance
        .get(`/auth/product/show/varainats/${id}`)
        .then((response) => response.data)
        .catch((error) => handleRequestError(error, 'Error deleting product'));
}
