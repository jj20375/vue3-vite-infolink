import axios from "@/services/axiosConfig";
import type { UserContractParamsInterface } from "@/views/user-panel/user-info/interface/userInterface";
const apiURL = import.meta.env.VITE_API_URL;

/**
 * 取得歷年合約紀錄
 */
export function GetContractListAPI(
    params?: UserContractParamsInterface | void
) {
    return axios.get(`${apiURL}/contract/paginate`, { params });
}
