import axios from "@/services/axiosConfig";
const apiURL = import.meta.env.VITE_API_URL;

/**
 * 報告下載列表
 */
export function GetReportListAPI(params?: any) {
    return axios.get(`${apiURL}/report/paginate`, { params });
}

/**
 * 取得報告語系選單資料
 */
export function GetReportLanguagesAPI() {
    return axios.get(`${apiURL}/report/language-list`);
}

/**
 * 取得報告產業別選單資料
 */
export function GetReportIndustriesAPI() {
    return axios.get(`${apiURL}/report/industry-list`);
}

/**
 * 取得報告名稱選單資料
 */
export function GetReportCategoriesAPI() {
    return axios.get(`${apiURL}/report/category-list`);
}
