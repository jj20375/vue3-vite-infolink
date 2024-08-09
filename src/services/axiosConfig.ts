import axios from "axios";
import router from "@/router";
import { getStorage, removeStorage } from "@/services/localStorage";
import i18n from "@/i18n/langs";
const timeout = 300000;
const instance = axios.create({
    timeout,
    baseURL: ``,
    headers: {},
});

// axios請求之前的動作
instance.interceptors.request.use(
    (config) => {
        // 有存在 localstorage 語系檔時使用此語係請求 api
        if (getStorage("lang")) {
            const lang: "tw" | "en" | "cn" = getStorage("lang");
            config.headers["X-Language"] = i18n[lang].iso;
        } else {
            // 預設請求 api 語系
            config.headers["X-Language"] = "zh_TW";
        }
        if (getStorage("token") !== null) {
            config.headers.Authorization = `Bearer ${getStorage("token")}`;
        }
        return config;
    },
    (error) => {
        console.log("error =>", error);
        return Promise.reject(error);
    }
);

// axios請求之後的動作
instance.interceptors.response.use(
    async (response) => response,
    (error) => {
        const { status, data } = error.response;
        if (status == 401 && data.message === "尚未登入") {
            removeStorage("token");
            router.push({ name: "login", params: { slug: "會員登入" } });
        }
        return Promise.reject(error);
    }
);

export default instance;
