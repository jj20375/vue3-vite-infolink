import { createI18n } from "vue-i18n";
import { getStorage } from "@/services/localStorage";
import enUS from "@/i18n/locales/en.json";
import zhTW from "@/i18n/locales/tw.json";
import zhCN from "@/i18n/locales/cn.json";
// 定義翻譯消息
const messages = {
    en: enUS,
    tw: zhTW,
    cn: zhCN,
};

// 創建 i18n 實例
const i18n = createI18n({
    // 使用 composition api 時 這裏要設置 false
    legacy: false,
    locale: getStorage("lang") ?? "tw", // 預設語言
    fallbackLocale: {
        en: ["en", "en-US"],
        tw: ["tw", "zh-TW"],
        cn: ["cn", "zh-CN"],
    },
    messages,
});

export default i18n;
