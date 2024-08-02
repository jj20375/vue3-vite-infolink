/**
 * 取得聯絡我們詢問類別 api 回應資料
 */
export interface GetContactUsQuestionCategoriesResponseAPIInterface {
    data: {
        data: {
            id: number;
            name: string;
        }[];
    };
}

/**
 * 聯絡我們表單 api 請求資料
 */
export interface ContactUsFormRequestAPIInterface {
    // 詢問類別 id
    contact_category_id: number;
    // 手機
    phone: string;
    // 主旨
    subject: string;
    // 內容
    content: string;
    // 檔案上傳圖片路徑
    attachments?: string[] | void;
}
