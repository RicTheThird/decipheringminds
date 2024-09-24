import { useJwt as decodeJwt } from "react-jwt"

import { KJUR } from 'jsrsasign'
import axiosInstance from './axiosInstance';

export interface UserProfile {
    email: string,
    role: string,
    unique_name: string,
    certserialnumber: string
}


function getRandomHexColor(): string {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return `${randomColor.padStart(6, '0')}`;
}

// Function to handle user login
export const login = async (userName: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { userName, password });
    // Save the token to localStorage or sessionStorage
    localStorage.setItem('authToken', response.data.token);
    return response.data;
};

// Function to handle user registration
export const register = async (user: any) => {
    const response = await axiosInstance.post('/auth/register', user);
    return response.data;
};

// Function to handle user registration
export const confirmEmail = async (token: string) => {
    const response = await axiosInstance.post('/auth/confirm-email', { token });
    return response.data;
};

// Function to handle user logout
export const logout = () => {
    // Remove the token from localStorage or sessionStorage
    localStorage.removeItem('authToken');
};

// Function to check if the user is authenticated
export const isAuthenticated = () => {
    // Check if the token exists in localStorage or sessionStorage
    return !!localStorage.getItem('authToken');
};

export const getUserProfile = () => {
    if (isAuthenticated()) {
        const decoded = decodeJwt<UserProfile>(localStorage.getItem('authToken') || '').decodedToken;
        localStorage.setItem('userId', decoded?.certserialnumber || '')
        let avatarBgColor = ''
        if(localStorage.getItem('avatarColor')) {
            avatarBgColor = localStorage.getItem('avatarColor') ?? getRandomHexColor()
        } else {
            avatarBgColor = getRandomHexColor()
            localStorage.setItem('avatarColor', avatarBgColor)
        }
        return {
            name: decoded?.unique_name,
            email: decoded?.email,
            role: decoded?.role,
            userId: decoded?.certserialnumber,
            avatarLink: `https://ui-avatars.com/api/?format=svg&rounded=true&name=${decoded?.unique_name?.split(' ')[0]}+${decoded?.unique_name?.split(' ')[1]}&background=${avatarBgColor}&color=fff`
        };
    }
    return null;
}

// Function to get the authentication token
export const getToken = () => {
    return localStorage.getItem('authToken');
};

export const getMeetingSignature = (meetingNumber, role, expirationSeconds) => {
    const iat = Math.floor(Date.now() / 1000)
    const exp = expirationSeconds ? iat + expirationSeconds : iat + 60 * 60 * 2
    const oHeader = { alg: 'HS256', typ: 'JWT' }

    const oPayload = {
        sdkKey: "MGJ749hdTHJqnAnzsyT4g",
        appKey: "MGJ749hdTHJqnAnzsyT4g",
        mn: meetingNumber,
        role,
        iat,
        exp,
        tokenExp: exp
    }

    const sHeader = JSON.stringify(oHeader)
    const sPayload = JSON.stringify(oPayload)
    const sdkJWT = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, "G4ejgMwF3ldIm8HUGJyghroVUOrDHO3K")
    return sdkJWT
}