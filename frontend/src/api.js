import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

export const getFinancialTips = async (email) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get-financial-tips/${email}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || "Something went wrong");
    }
};