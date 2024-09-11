import axios, { AxiosResponse, AxiosRequestHeaders } from 'axios';
import {DTOs} from "@/shared/dto/dtos";
import SignInDTO = DTOs.SignInDTO;
import AuthorizationDTO = DTOs.AuthorizationDTO;
import UserDTO = DTOs.UserDTO;
import MessageDTO = DTOs.MessageDTO;
const API_BASE_URL = 'https://dce4-37-30-10-29.ngrok-free.app';

export const login = async (credentials: SignInDTO): Promise<AxiosResponse<AuthorizationDTO>> => {
    return axios.post<AuthorizationDTO>(`${API_BASE_URL}/accounts/login`, credentials);
};


export const register = async (userData: UserDTO): Promise<AxiosResponse<UserDTO>> => {
    return axios.post<UserDTO>(`${API_BASE_URL}/accounts/register`, userData);
};


export const sendMessage = async (messageData: MessageDTO, headers: AxiosRequestHeaders): Promise<AxiosResponse<void>> => {
    return axios.post<void>(`${API_BASE_URL}/messages`, messageData, { headers });
};


export const readRandomMessage = async (headers: AxiosRequestHeaders ): Promise<AxiosResponse<DTOs.MessageDTO>> => {
    return axios.get<MessageDTO>(`${API_BASE_URL}/messages`, { headers });
};


export const getUserById = async (id: string): Promise<AxiosResponse<UserDTO>> => {
    return axios.get<UserDTO>(`${API_BASE_URL}/users/${id}`);
};

export const honorUser = async (authorClientAppId: string | undefined, headers: AxiosRequestHeaders): Promise<AxiosResponse<void>> => {
    return axios.patch<void>(`${API_BASE_URL}/users/${authorClientAppId}/points`, null, { headers });
};



export const getAllUsers = async (): Promise<AxiosResponse<UserDTO[]>> => {
    return axios.get<UserDTO[]>(`${API_BASE_URL}/users`);
};


export const updateUser = async (id: string, userData: Partial<UserDTO>): Promise<AxiosResponse<UserDTO>> => {
    return axios.put<UserDTO>(`${API_BASE_URL}/users/${id}`, userData);
};


export const deprecateUser = async (id: string): Promise<AxiosResponse<void>> => {
    return axios.delete<void>(`${API_BASE_URL}/users/${id}`);
};