// 設置localStorage
export const setStorage = function (key: string, obj: any) {
    const json = JSON.stringify(obj);
    window.localStorage.setItem(key, json);
};

// 獲取localStorage
export const getStorage = function (key: string) {
    const str = window.localStorage.getItem(key);
    if (!str || str === "undefined") {
        return null;
    }
    return JSON.parse(str);
};

// 移除localStorage
export const removeStorage = function (key: string) {
    window.localStorage.removeItem(key);
};
