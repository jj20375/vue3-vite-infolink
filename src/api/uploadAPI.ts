import axios from "@/services/axiosConfig";
const apiURL = import.meta.env.VITE_API_URL;
import { getStorage } from "@/services/localStorage";

/**
 * 檔案上傳 form post api
 * @param file
 * @returns
 */
export function UploadAttachmentAPI(file: FormData) {
    return axios.post(`${apiURL}/contact/upload-attachment`, file, {
        headers: {
            Authorization: `Bearer ${getStorage("token")}`,
            "Content-Type": "multipart/form-data",
        },
    });
}
