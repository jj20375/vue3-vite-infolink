import CryptoJS from "crypto-js";

//判斷是否為空值或空物件
export const isEmpty = (value: any) => {
    return (
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0) ||
        value.length === 0
    );
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

/**
 * 解密網址判斷是否可以查看非維護狀態中的網站
 */
export const decryptData = ({ hashData, randData }: any) => {
    const encryptData = hashData as string;
    const key = CryptoJS.enc.Utf8.parse(randData.slice(0, 32) as string);
    const iv = CryptoJS.enc.Utf8.parse(randData.slice(32, 48) as string);

    const decryptData = CryptoJS.AES.decrypt(encryptData, key, {
        mode: CryptoJS.mode.CBC,
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
    });
    return decryptData.toString(CryptoJS.enc.Utf8);
};
