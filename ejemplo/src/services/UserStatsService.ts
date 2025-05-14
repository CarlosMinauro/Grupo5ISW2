import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL;

export const getUserStatistics = async () => {
    try {
        const response = await axios.get(`${API_URL}/user-statistics`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user statistics:", error);
        return null;
    }
};
