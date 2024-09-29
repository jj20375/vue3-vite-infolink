import type { PaginationAPIInterface } from "@/interface/global.d";
// 使用者資料 type
export interface UserPanelUserInfoResponseAPIInterface {
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
    // 判斷需要不需要重設密碼
    needSettingPassword: boolean;
    // 判斷需要不需要設定初始資料
    needSettingProfile: boolean;
    // 部門權限
    departments?: {
        name: string;
        account_type: "main" | "sub" | "composite";
    }[];
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

/**
 * 更新個人資料 api
 */
export interface UserUpdateProfileRequestAPIInterface {
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
export interface UserContractListResponseAPIInterface {
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
    report_category_ids?: number;
}

/**
 * 子帳號列表 api
 */
export interface UserSubAccountsResponseAPIInterface {
    data: {
        data: {
            [key: string]: string[];
        };
    };
}

/**
 * 修改密碼 api 請求參數
 */
export interface UserChangePasswordRequestAPIInterface {
    old_password: string;
    new_password: string;
    new_password_confirmation: string;
}

/**
 * 歷年合約購買報告項目下拉選單 api 回應參數
 */
export interface UserContractCategoriesResponseAPIInterface {
    data: {
        messasge: string;
        data: {
            id: number;
            name: string;
        }[];
    };
}
