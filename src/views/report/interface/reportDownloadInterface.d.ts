import type { PropType, DefineComponent } from "vue";
import type { LocationAsRelativeRaw } from "vue-router";
import type {
    OptionsInterface,
    ColumnsInterface,
    PaginationAPIInterface,
} from "@/interface/global.d";
// 下載報表表單欄位 key
export type ReportDownloadPropType =
    | "industry"
    | "language"
    | "period"
    | "category"
    | "name";
// 表單欄位搜尋條件 interface
export interface ReportDownloadFilterColumnsInterface
    extends ColumnsInterface<ReportDownloadPropType> {
    prop: ReportDownloadPropType;
    iconName?: typeof DefineComponent;
}
// 下載表單欄位資料 interface
export interface ReportDownloadDataInterface {
    id: number;
    // 報表名稱
    name: string;
    // 產業別
    industry: string;
    // 報表語系
    language: string;
    // 期數
    period: string;
    // 發布時間
    publishTime: string;
    // 下載次數
    downloadCount: number;
    // 檔案格式
    fileTypes: string[];
    // vue router path
    path: LocationAsRelativeRaw;
}

/**
 * 報告下載列表 api 資料
 */
export interface ReportDownloadDataListResponseAPIInterface {
    data: {
        data: {
            rows: {
                id: number;
                // 產業別
                report_industry: string;
                // 語系
                language: string;
                // 報告名稱
                name: string;
                // 期數
                period: string;
                // 檔案類型
                files: {
                    [key: string]: boolean;
                };
                // 發佈日期
                published_at: string;
                // 下載次數
                download_count: number;
            }[];
            meta: PaginationAPIInterface;
        };
    };
}

/**
 * 報告下載列表過濾參數
 */
export interface ReportDownloadParamsInterface {
    page?: number;
    // 報告關鍵字
    keyword?: string;
    //  報告語系
    languages?: string[];
    // 產業別
    report_industry_ids?: number[];
    // 報告名稱
    report_category_ids?: number[];
    // 開始期數日期
    start_period?: string;
    // 結束期數日期
    end_period?: string;
}

/**
 * 取得報告語系下拉選單 api 資料
 */
export interface ReportDownloadLanguagesAPIInterface {
    data: {
        data: {
            [key: string]: string;
        };
    };
}

/**
 * 取得報告產業別下拉選單 api 資料
 */
export interface ReportDownloadIndustriesAPIInterface {
    data: { data: { id: number; name: string }[] };
}

/**
 * 取得報告名稱(分類)下拉選單 api 資料
 */
export interface ReportDownloadCategoriesAPIInterface {
    data: { data: { id: number; name: string }[] };
}

/**
 * 取得報表下載驗證碼 api
 */
export interface GetReportDownloadEmailValidateCodeAPIInterface {
    report_id: number;
}

/**
 *  驗證報表下載驗證碼 api
 */
export interface ReportDownloadVerifyEmailValidateCodeAPIInterface {
    report_id: number;
    file_type: string;
    verification_code: string;
}

/**
 * 取得報告詳情資料傳送參數 api
 */
export interface ReportDetailAPIInterface {
    id: number;
}

/**
 * 報告詳情資料回應內容 api
 */
export interface ReportDetailResponseAPIInterface {
    data: {
        data: {
            id: number;
            // 報告產業別
            report_industry: string;
            // 語系
            language: string;
            // 報告名稱
            name: string;
            // 報告內容
            content: string;
            // 期數日期
            period: string;
            // 檔案類型
            files: {
                [key: string]: boolean;
            };
            // 發佈日期
            published_at: string;
        };
    };
}
