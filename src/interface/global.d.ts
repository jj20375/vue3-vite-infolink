import type { DefineComponent } from "vue";
export interface OptionsInterface {
    label: string;
    value: any;
}

export interface ColumnsInterface<Prop extends string> {
    type?: string;
    showPassword?: boolean;
    prop: Prop;
    key?: string;
    label?: string | undefined;
    placeholder?: string;
    placeholderStart?: string;
    placeholderEnd?: string;
    style: string;
    disabled?: boolean;
    span?: string;
    row?: number;
    iconName?: typeof DefineComponent;
    options?: { value: string | number; label: string }[];
    // 手機版是否隱藏 表單欄位標題
    mobileHideLabel?: boolean;
    onChange?: Function | undefined;
}

// 分頁 api 資料
export interface PaginationAPIInterface {
    total: number;
    limit: number;
    last_page: number;
    current_page: number;
}
