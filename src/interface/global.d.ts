export interface OptionsInterface {
    label: string;
    value: any;
}

export interface ColumnsInterface<Prop> {
    type?: string;
    showPassword?: boolean;
    prop: Prop;
    label?: string;
    placeholder?: string;
    style: string;
    disabled?: boolean;
    span?: string;
    options?: { value: string; label: string }[];
    // 手機版是否隱藏 表單欄位標題
    mobileHideLabel?: boolean;
    onChange?: Function | undefined;
}
