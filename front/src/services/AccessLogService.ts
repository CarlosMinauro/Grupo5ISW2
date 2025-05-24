import { API_URL, ENDPOINTS } from '../config/api';

export const getAccessLogs = async () => {
    let res: any;
    try {
        res = await fetch(import.meta.env.VITE_API_URL + "/accesslogs"); 
    } catch (e) {
        console.log(e);
    }

    if (!res.ok) {
        res.json({ msg: "Error fetching access logs" });
    }

    return await res.json();
};

export const fetchAccessLogs = async () => {
    try {
        const response = await fetch(ENDPOINTS.ACCESS_LOGS);
        // ... existing code ...
    } catch (error) {
        console.error('Error fetching access logs:', error);
        throw error;
    }
};