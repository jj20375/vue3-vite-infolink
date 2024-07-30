// 歷年合約紀錄 欄位
export interface UserContractDataInterface {
    id?: number | null;
    // 合約開立日
    contractIssuedDate: string;
    // 合約生效日
    contractEffectiveDate: string;
    // 合約到期日
    contractExpiryDate: string;
    // 購買報告項目
    purchasedReport: string[];
}
