import axios from "@/services/axiosConfig";
import type {
    GetReportDownloadEmailValidateCodeAPIInterface,
    ReportDetailAPIInterface,
    ReportDetailResponseAPIInterface,
    ReportDownloadManualResponseAPIInterface,
    ReportDownloadParamsInterface,
    ReportDownloadVerifyEmailValidateCodeAPIInterface,
} from "@/views/report/interface/reportDownloadInterface";
const apiURL = import.meta.env.VITE_API_URL;

/**
 * 報告下載列表
 */
export function GetReportListAPI(
    params?: ReportDownloadParamsInterface | void
) {
    return axios.get(`${apiURL}/report/paginate`, { params });
}

/**
 * 取得報告語系選單資料
 */
export function GetReportLanguagesAPI() {
    return axios.get(`${apiURL}/report/language-list`);
}

/**
 * 取得報告產業別選單資料
 */
export function GetReportIndustriesAPI() {
    return axios.get(`${apiURL}/report/industry-list`);
}

/**
 * 取得報告名稱選單資料
 */
export function GetReportCategoriesAPI() {
    return axios.get(`${apiURL}/report/category-list`);
}

/**
 * 取得報表下載驗證碼
 */
export function GetReportDownloadEmailValidateCodeAPI(
    data: GetReportDownloadEmailValidateCodeAPIInterface
) {
    return axios.post(
        `${apiURL}/report/send-download-report-file-verification-code`,
        data
    );
}

/**
 * 驗證報表下載驗證碼
 */
export function ReportDownloadVerifyEmailValidateCodeAPI(
    data: ReportDownloadVerifyEmailValidateCodeAPIInterface
) {
    return axios.post(
        `${apiURL}/report/verify-download-report-file-verification-code`,
        data
    );
}

/**
 * 取得報告說明書檔案下載列表
 * @param params
 * @returns
 */
export function GetReportDownloadManualListAPI(): Promise<ReportDownloadManualResponseAPIInterface> {
    return axios.get(`${apiURL}/report/common-file-list`);
}

/**
 * 取得報告詳情資料
 */
export function GetReportDetailAPI(
    params: ReportDetailAPIInterface
): Promise<ReportDetailResponseAPIInterface> {
    return axios.get(`${apiURL}/report/detail`, { params });
}
