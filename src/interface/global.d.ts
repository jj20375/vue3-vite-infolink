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
    style: string;
    disabled?: boolean;
    span?: string;
    row?: number;
    iconName?: typeof DefineComponent;
    options?: { value: string; label: string }[];
    // 手機版是否隱藏 表單欄位標題
    mobileHideLabel?: boolean;
    onChange?: Function | undefined;
}
