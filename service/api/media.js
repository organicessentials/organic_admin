import axios from "axios";
import config from "../config";
import { handleRequestError } from "../common";

const { baseURL } = config;

const instance = axios.create({
  baseURL,
  timeout: 5000, // Set an appropriate timeout value
});

export function upload(image) {
  return instance
    .post(`/auth/upload`,image)
    .then((response) => response.data)
    .catch((error) =>
      handleRequestError(error, "Error getting attribute values")
    );
}

export function show() {
  return instance
    .get(`/auth/media-images`)
    .then((response) => response.data)
    .catch((error) =>
      handleRequestError(error, "Error getting attribute values")
    );
}

export function showId(id) {
  return instance
    .get(`/auth/media-image/${id}`)
    .then((response) => response.data)
    .catch((error) =>
      handleRequestError(error, "Error getting attribute values")
    );
}

export function updateId({ id, data }) {
  return instance
    .put(`/auth/media-image/${id}`, data)
    .then((response) => response.data)
    .catch((error) =>
      handleRequestError(error, "Error getting attribute values")
    );
}

export function deleteId(id) {
  return instance
    .delete(`/auth/media-image/${id}`)
    .then((response) => response.data)
    .catch((error) =>
      handleRequestError(error, "Error getting attribute values")
    );
}


