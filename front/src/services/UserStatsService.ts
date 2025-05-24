import axios from "axios";
import { API_URL, ENDPOINTS } from '../config/api';

export const getUserStatistics = async () => {
    try {
        const response = await axios.get(`${API_URL}/user-statistics`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user statistics:", error);
        return null;
    }
};

export const fetchUserStats = async () => {
    try {
        const response = await fetch(ENDPOINTS.USER_STATS);
        // ... existing code ...
    } catch (error) {
        console.error('Error fetching user stats:', error);
        throw error;
    }
};
