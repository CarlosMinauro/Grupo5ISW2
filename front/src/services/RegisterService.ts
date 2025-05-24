import { API_URL, ENDPOINTS } from '../config/api';
import { RegisterUserData } from '../components/RegisterForm';

export async function registerUser(userData: RegisterUserData) {
    const resp = await fetch(ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    return await resp.json();
}

export async function sendRegisterEmail(email: string) {
    const mainpage = `${window.location.origin}/proyectoSW/app/dashboard`;
    const text = `
        <p>Hello,</p>
        <p>Thank you for registering! Click the link below to access to the main page:</p>
        <a href="${mainpage}" target="_blank">Go to Main Page</a>
        <p>If the link doesn't work, copy and paste this URL into your browser:</p>
        <p>${mainpage}</p>
    `;
    const response = await fetch(ENDPOINTS.REGISTER_EMAIL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            to: email,
            subject: 'Welcome to Expense Tracker',
            html: text,
        }),
    });
    // Devuelvo el mensaje simulado del backend
    return await response.json();
} 