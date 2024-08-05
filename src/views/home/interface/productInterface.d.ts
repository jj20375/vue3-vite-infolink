import { PaginationAPIInterface } from "@/interface/global";

/**
 * 取得產品分類列表 api 回應值
 */
export interface ProductCategoriesResponseAPIInterface {
    data: {
        data: { id: number; name: string }[];
    };
}

/**
 * 產品列表 api 回應值
 */
export interface ProductListResponseAPIInterface {
    data: {
        data: {
            rows: {
                id: number;
                // 標題
                name: string;
                // 內文
                content: string;
                // 分類資料
                productCategory: {
                    id: number;
                    name: string;
                };
            }[];
            meta: PaginationAPIInterface;
        };
    };
}

/**
 * 產品列表過濾參數 api
 */
export interface ProductListParamsAPIInterface {
    // 分類 id
    category_id?: number;
    // 分頁
    page?: number;
}

/**
 * 分類資料
 */
export interface ProductCategoryInterface {
    id: number;
    name: string;
}

/**
 * 產品資料
 */
export interface ProductInterface {
    id: number;
    // 標題
    title: string;
    // 內文
    content: string;
    // 分類資料
    productCategory: {
        id: number;
        name: string;
    };
}
