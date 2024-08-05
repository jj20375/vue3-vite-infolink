import axios from "@/services/axiosConfig";
import type { PostListResponseAPIInterface } from "@/views/home/interface/postInterface";

const apiURL = import.meta.env.VITE_API_URL;

/**
 * 取得文章列表資料
 */
export function GetPostListAPI(
    params?: { page: number } | void
): Promise<PostListResponseAPIInterface> {
    return axios.get(`${apiURL}/article/paginate`, { params });
}
