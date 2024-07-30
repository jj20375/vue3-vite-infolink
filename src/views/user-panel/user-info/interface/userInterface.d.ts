import type { PaginationAPIInterface } from "@/interface/global.d";
// 使用者資料 type
export interface UserPanelUserInfoInterface {
    // 信箱
    email?: string;
    // 使用者名稱
    name?: string;
    // 手機號碼
    phone?: string;
    // 頭銜
    jobTitle?: string;
    // 通訊軟體名稱
    messagingApp?: string;
    // 通訊軟體自訂名稱
    messagingAppCustomName?: string;
    // 通訊軟體 id
    messagingAppId?: string;
    // 國家
    company?: string;
}

// 公司資料 type
export interface UserPanelCompanyInterface {
    // 公司名稱
    name: string;
    // 公司網址
    webURL: string;
    // 所屬國家
    region: string;
    // 地址
    address: string;
}

// 子帳號資料 type
export interface UserPanelSubAccountsInterface {
    // 太陽能相關子帳號
    solarEnergySubAccounts?: string[];
    // 儲能相關子帳號
    storedEnergySubAccounts?: string[];
}

/**
 * 更新個人資料 api
 */
export interface UserUpdateProfileAPIInterface {
    // 姓名
    name: string;
    // 職稱
    title: string;
    phone: string;
    // 通訊軟體名稱
    im_name?: string;
    // 通訊軟體 id
    im_account?: string;
}

/**
 * 歷年合約紀錄列表 api
 */
export interface UserContractListAPIInterface {
    data: {
        data: {
            rows: {
                created_at: string;
                enabled_at: string;
                expired_at: string;
                contractReportNames: string[];
            }[];
            meta: PaginationAPIInterface;
        };
    };
}

/**
 * 歷年合約紀錄搜尋條件
 */
export interface UserContractParamsInterface {
    page?: number;
    // 關鍵字
    keyword?: string;
    // 排序欄位
    order_column?: string;
    // 排序方式 倒序(desc)或者正序(asc)
    order_direction?: "desc" | "asc";
    // 報告名稱
    report_category_id?: number;
}
