import axios from "@/services/axiosConfig";
const apiURL = import.meta.env.VITE_API_URL;

/**
 * 上傳檔案
 */
export function UploadAPI(data: any) {
    return axios.post(`${apiURL}/file/upload`, data);
}
