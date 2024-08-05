import axios from "@/services/axiosConfig";
import type {
    ProductListParamsAPIInterface,
    ProductCategoriesResponseAPIInterface,
    ProductListResponseAPIInterface,
} from "@/views/home/interface/productInterface";
const apiURL = import.meta.env.VITE_API_URL;

/**
 * 取得產品分類列表
 */
export function GetProductCategoriesAPI(): Promise<ProductCategoriesResponseAPIInterface> {
    return axios.get(`${apiURL}/product/category-list`);
}

/**
 * 取得產品列表資料
 */
export function GetProductListAPI(
    params?: ProductListParamsAPIInterface | void
): Promise<ProductListResponseAPIInterface> {
    return axios.get(`${apiURL}/product/paginate`, { params });
}
