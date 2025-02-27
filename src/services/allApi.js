// import { baseUrl, baseUrl2 } from "./baseUrl";
import commonApi from "./CommonApi";

const baseUrl = import.meta.env.VITE_BACKEND_URL1;
const baseUrl2 = import.meta.env.VITE_BACKEND_URL2;


//login api
export const login = async (logindata) => {
    try {
        const response = await commonApi('POST', `${baseUrl}/user/login`, logindata)
        return response;
    }
    catch {
        console.error("Error in login data:", error.message);
        return { error: true, message: error.message };
    }
}


//batches Api 
export const getBatches = async (token) => {
    try {
        const headers = {
            Authorization: `Bearer ${token}`,
        };

        const response = await commonApi(
            "GET",
            `${baseUrl}/batch?_end=500&_order=DESC&_sort=createdAt&_start=0&filter=%5B%5D`,
            null, 
            headers
        );

        return response;
    } catch (error) {
        console.error("Error fetching batches data:", error.message);
        return { error: true, message: error.message };
    }
};


//Crm attendance api
export const batchByAttendace = async (id) => {
    try {
        const response = await commonApi('GET', `${baseUrl2}attendance/batch/${id}/`, '')
        return response;
    }
    catch {
        console.error("Error in login data:", error.message);
        return { error: true, message: error.message };
    }
}