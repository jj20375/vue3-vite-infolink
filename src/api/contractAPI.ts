import axios from "@/services/axiosConfig";
import type {
    UserContractCategoriesResponseAPIInterface,
    UserContractParamsInterface,
} from "@/views/user-panel/user-info/interface/userInterface";
const apiURL = import.meta.env.VITE_API_URL;

/**
 * 取得歷年合約紀錄
 */
export function GetContractListAPI(
    params?: UserContractParamsInterface | void
) {
    return axios.get(`${apiURL}/contract/paginate`, { params });
}

/**
 * 歷年合約購買報告項目下拉選單
 */
export function GetContractCategoriesAPI(): Promise<UserContractCategoriesResponseAPIInterface> {
    return axios.get(`${apiURL}/contract/category-list`);
}
