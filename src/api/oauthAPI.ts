import axios from "@/services/axiosConfig";
const apiURL = import.meta.env.API_URL;

/**
 * 使用者登入
 * @param data
 * @returns
 */
export function UserLoginAPI(data: any) {
    return axios.post(`${apiURL}/member/login`, data);
}
