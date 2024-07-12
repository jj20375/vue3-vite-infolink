//判斷是否為空值或空物件
export const isEmpty = (value: any) => {
    return value === undefined || value === null || (typeof value === "object" && Object.keys(value).length === 0) || (typeof value === "string" && value.trim().length === 0) || value.length === 0;
};

/**
 * 判斷是否為 image 的 file
 * @param { type String(字串) } type 檔案類型
 */
export const isImageType = (type: string) => {
    switch (type) {
        case "image/jpeg":
            return true;
        case "image/jpg":
            return true;
        case "image/png":
            return true;
        case "image/gif":
            return true;
        default:
            return false;
    }
};
