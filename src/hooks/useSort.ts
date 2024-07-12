import { ref } from "vue";

// 排序欄位名稱
const sortField = ref<string | null>(null);
// 是否上升排列
const sortAscend = ref<boolean | null>(null);

/**
 * 取得排序圖示的 icon name
 *
 *
 * @param {string} field 欄位名稱
 *
 * @returns {string} 排序圖示的 icon name
 */
const getSortIconName = (field: string) => {
    let sortAscendClass = "default";
    if (field === sortField.value) {
        sortAscendClass = sortAscend.value ? "up" : "down";
    }
    return `arrow_sort_${sortAscendClass}`;
};

/**
 * 設定排序欄位
 *
 *
 * @param {string} field 欄位名稱
 *
 * @returns {void}
 */
const setSort = (field: string) => {
    if (field === sortField.value) {
        sortAscend.value = !sortAscend.value;
    } else {
        sortField.value = field;
        sortAscend.value = true;
    }
};

export function useSort() {
    return {
        sortField,
        sortAscend,
        getSortIconName,
        setSort,
    };
}
