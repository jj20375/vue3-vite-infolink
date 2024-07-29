import axios from "@/services/axiosConfig";
const apiURL = import.meta.env.VITE_API_URL;

/**
 * 取得合約紀錄
 */
export function GetContractListAPI(params?: any) {
    return axios.get(`${apiURL}/contract/paginate`, { params });
}
