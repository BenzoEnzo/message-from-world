import axios from 'axios';

const API_BASE_URL = '/api';

export const login = async (credentials) => {
    return axios.post(`${API_BASE_URL}/accounts/login`, credentials);
};

export const register = async (userData) => {
    return axios.post(`${API_BASE_URL}/accounts/register`, userData);
};

export const sendMessage = async (messageData, headers) => {
    return axios.post(`${API_BASE_URL}/messages`, messageData, headers);
};

export const readRandomMessage = async (headers) => {
    return axios.get(`${API_BASE_URL}/messages`, headers);
};

export const getUserById = async (id) => {
    return axios.get(`${API_BASE_URL}/users/${id}`);
};

export const getAllUsers = async () => {
    return axios.get(`${API_BASE_URL}/users`);
};

export const updateUser = async (id, userData) => {
    return axios.put(`${API_BASE_URL}/users/${id}`, userData);
};

export const deprecateUser = async (id) => {
    return axios.delete(`${API_BASE_URL}/users/${id}`);
};