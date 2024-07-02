import axios from "@/services/axiosConfig";
const apiURL = import.meta.env.API_URL;

/**
 * 取得使用者資料
 * @returns
 */
export function GetUserProfileAPI() {
    return axios.get(`${apiURL}/member/profile`);
}
