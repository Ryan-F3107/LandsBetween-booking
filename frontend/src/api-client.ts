import { SignInFormData } from './pages/SignIn';
/* 
Keep fetch request here, fetch requests to backend
 */
import { RegisterFormData } from "./pages/Register";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
//API call [POST] to register user
export const register = async (formData:RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        credentials:"include",/* Anytime a POST request is made, include http cookie and set any cookie onto the browser */
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(formData),
    });

    const responseBody = await response.json();
    if(!response.ok){
        throw new Error(responseBody.message);
    }
}
//Connect with Backend API
export const signIn = async (formData:SignInFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method:'POST',
        credentials: "include",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(formData)
    });

    const body = await response.json();
    if(!response.ok){
        throw new Error(body.message);
    }
    return body;
}

export const signOut = async() => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        credentials: "include", //pass the current auth cookie
        method:"POST"
    });
    if(!response.ok){
        throw new Error("Error during sign out")
    }
}

export const validateToken = async() => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`,{
        credentials: "include",   //tells browser to send any cookies included
    });
    if(!response.ok){
        throw new Error("Token invalid");
    }
    return response.json();
}