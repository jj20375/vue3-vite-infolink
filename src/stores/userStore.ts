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
import { useInitStore } from "./initStore";
import { decryptData, isEmpty } from "@/services/utils";

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
        needSettingProfile: false,
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
        return (user.value = {
            email: "",
            name: "",
            jobTitle: "",
            phone: "",
            needSettingProfile: false,
        });
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
        // 取得 localstorage 維護狀態 hash 值
        const hashData = getStorage("maintenanceHashData");
        // 取得 localstorage 維護狀態 iv 值
        const randData = getStorage("maintenanceRandData");
        // 判斷當網站維護中時 不往下執行
        if (
            useInitStore().initData.site.maintenance_mode &&
            isEmpty(hashData) &&
            isEmpty(randData)
        ) {
            return;
        }
        async function callApi() {
            try {
                const { data }: any = await GetUserProfileAPI();
                setIsAuth();
                user.value = {
                    jobTitle: data.data.title,
                    ...data.data,
                    messagingApp: data.data.im_name || null,
                    messagingAppId: data.data.im_account || null,
                    // 判斷需不需要設定初始資料
                    needSettingProfile: data.data.is_need_to_complete || false,
                };
                company.value = {
                    name: data.data.company.name,
                    webURL: data.data.company.website,
                    region: data.data.company.country,
                    address: data.data.company.address,
                };
                // 判斷需要重設初始化密碼時
                if (data.data.initial_password) {
                    console.log("redirect to rest password");
                    return router.push({
                        name: "reset-password",
                        params: {
                            slug: i18nData()["router"]["reset-password"],
                        },
                    });
                }
                // 判斷需要設定預設資料時導頁去會員資料管理畫面
                if (data.data.is_need_to_complete) {
                    return router.push({
                        name: "user-info",
                        params: {
                            level2Slug: i18nData()["router"]["user-info"],
                        },
                    });
                }

                return data.data;
            } catch (err) {
                console.log("GetUserProfileAPI err =>", err);
            }
            return user.value;
        }

        // 判斷有取得 維護模式 hash與iv值時 判斷是否為維護模式並解密 hash 與 iv 值
        if (!isEmpty(hashData) && !isEmpty(randData)) {
            // 解密函示 如果有值 且為 1 代表解密成功
            const decryptedData = await decryptData({
                hashData,
                randData,
            });
            // 當維護模式 且解密值 為 "1" 時 取得 個人資料 api
            if (
                useInitStore().initData.site.maintenance_mode &&
                decryptedData === "1"
            ) {
                return await callApi();
            }
        }

        // 非維護模式時 取得個人資料 api
        if (!useInitStore().initData.site.maintenance_mode) {
            return await callApi();
        }
        return await callApi();
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
