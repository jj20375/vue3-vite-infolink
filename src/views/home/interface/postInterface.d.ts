import { PaginationAPIInterface } from "@/interface/global";

/**
 * 取得文章列表回應 api
 */
export interface PostListResponseAPIInterface {
    data: {
        data: {
            rows: {
                id: number;
                title: string;
                content: string;
                is_top: boolean;
                // 發佈時間
                published_at: Date;
                articleCategory: {
                    id: number;
                    name: string;
                };
            }[];
            meta: PaginationAPIInterface;
        };
    };
}

/**
 * 文章資料
 */
export interface PostInterface {
    id: number;
    title: string;
    content: string;
    // 發佈日期
    publishedAt: Date;
    articleCategory: {
        id: number;
        name: string;
    };
}
