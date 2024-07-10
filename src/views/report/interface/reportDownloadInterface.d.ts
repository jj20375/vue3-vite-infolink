import type { PropType, DefineComponent } from "vue";
import type { LocationAsRelativeRaw } from "vue-router";
import type { OptionsInterface, ColumnsInterface } from "@/interface/global.d";
// 下載報表表單欄位 key
export type ReportDownloadPropType = "industry" | "language" | "period" | "category" | "name";
// 表單欄位搜尋條件 interface
export interface ReportDownloadFilterColumnsInterface extends ColumnsInterface<ReportDownloadPropType> {
    prop: ReportDownloadPropType;
    iconName?: typeof DefineComponent;
}
// 下載表單欄位資料 interface
export interface ReportDownloadDataInterface {
    id: string | number;
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
    fileType: string[];
    // vue router path
    path: LocationAsRelativeRaw;
}
