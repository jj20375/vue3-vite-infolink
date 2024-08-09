import { ref } from "vue";
import { defineStore } from "pinia";
import type {
    UserPanelUserInfoResponseAPIInterface,
    UserPanelCompanyInterface,
} from "@/views/user-panel/user-info/interface/userInterface";
import { removeStorage } from "@/services/localStorage";
import { GetSubAccountsAPI, GetUserProfileAPI } from "@/api/userAPI";
import { useRouter } from "vue-router";
import enUS from "@/i18n/locales/en.json";
import zhTW from "@/i18n/locales/tw.json";
import zhCN from "@/i18n/locales/cn.json";
import { getStorage } from "@/services/localStorage";

const i18nData: any = () => {
    switch (getStorage("lang")) {
        case "en":
            return enUS;
        case "tw":
            return zhTW;
        case "cn":
            return zhCN;
        default:
            return zhTW;
    }
};

export const useUserStore = defineStore("userStore", () => {
    const router = useRouter();

    // 使用者資料
    const user = ref<UserPanelUserInfoResponseAPIInterface>({
        email: "test@gmail.com",
        name: "測試名稱",
        phone: "0933123123",
        jobTitle: "CEO",
    });
    // 使用者公司資料
    const company = ref<UserPanelCompanyInterface>({
        name: "可思科技股份有限公司",
        webURL: "https://www.codepulse.com.tw/zh-tw/",
        address: "台北市中正區忠孝東路一段76號5f之一",
        region: "台灣",
    });
    // 子帳號資料
    const subAccounts = ref<{ [key: string]: string[] }>({});
    // 判斷是否有登入
    const isAuth = ref(false);

    /**
     * 設定使用者資料
     */
    function setUser(userData: any) {
        return (user.value = userData);
    }

    /**
     * 設定是否登入
     */
    function setIsAuth() {
        return (isAuth.value = true);
    }
    /**
     * 清除使用者資料
     */
    function clearUser() {
        removeStorage("token");
        return (user.value = {});
    }
    /**
     * 清除是否登入
     */
    function clearIsAuth() {
        return (isAuth.value = false);
    }

    /**
     * 設定子帳號資料
     */
    function setSubAccounts(data: { [key: string]: string[] }) {
        subAccounts.value = data;
    }

    /**
     * 取得使用者資料
     */
    async function getUserPorfile() {
        try {
            const { data }: any = await GetUserProfileAPI();
            setIsAuth();
            // 判斷需要重設初始化密碼時
            if (data.data.initial_password) {
                return router.push({
                    name: "reset-password",
                    params: { slug: i18nData()["router"]["reset-password"] },
                });
            }
            user.value = {
                jobTitle: data.data.title,
                ...data.data,
                messagingApp: data.data.im_name || null,
                messagingAppId: data.data.im_account || null,
            };
            company.value = {
                name: data.data.company.name,
                webURL: data.data.company.website,
                region: data.data.company.country,
                address: data.data.company.address,
            };

            return data.data;
        } catch (err) {
            console.log("GetUserProfileAPI err =>", err);
        }
        return user.value;
    }

    /**
     * 取得使用者底下的子帳號列表
     */
    async function getSubAccounts() {
        try {
            const { data }: any = await GetSubAccountsAPI();
            setSubAccounts(data.data);
            return data.data;
        } catch (err) {
            console.log("GetSubAccountsAPI err =>", err);
        }
        return subAccounts.value;
    }

    /**
     * 移除登入資料與狀態
     */
    function removeUser() {
        clearUser();
        clearIsAuth();
    }

    return {
        user,
        company,
        subAccounts,
        isAuth,
        setUser,
        setIsAuth,
        getUserPorfile,
        getSubAccounts,
        setSubAccounts,
        removeUser,
    };
});
