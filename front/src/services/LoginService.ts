import { ENDPOINTS } from '../config/api';
import { LoginUserData } from '../components/LoginForm';

// Principio SRP: Este servicio solo se encarga de la autenticación
export async function loginUser(userData: LoginUserData) {
    // Principio DIP: El componente depende de esta abstracción, no de la implementación concreta de fetch
    const resp = await fetch(ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return await resp.json();
} 