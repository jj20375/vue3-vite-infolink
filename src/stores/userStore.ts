import { ref } from "vue";
import { defineStore } from "pinia";
import type {
    UserPanelUserInfoInterface,
    UserPanelCompanyInterface,
    UserPanelSubAccountsInterface,
} from "@/views/user-panel/user-info/interface/userInterface";
import { removeStorage } from "@/services/localStorage";
import { GetUserProfileAPI } from "@/api/userAPI";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

export const useUserStore = defineStore("userStore", () => {
    const router = useRouter();
    const { t } = useI18n();

    // 使用者資料
    const user = ref<UserPanelUserInfoInterface>({
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
    const subAccounts = ref<UserPanelSubAccountsInterface>({
        solarEnergySubAccounts: [
            "ili.wang@codepulse.com.tw",
            "gina.chen@codepulse.com.tw",
            "joe.lee@codepulse.com.tw",
            "ili.wang@codepulse.com.tw",
            "gina.chen@codepulse.com.tw",
            "joe.lee@codepulse.com.tw",
        ],
        storedEnergySubAccounts: [
            "ili.wang@codepulse.com.tw",
            "gina.chen@codepulse.com.tw",
            "joe.lee@codepulse.com.tw",
            "ili.wang@codepulse.com.tw",
            "gina.chen@codepulse.com.tw",
            "joe.lee@codepulse.com.tw",
        ],
    });
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
    function setIsAuth(isAuthData: boolean) {
        return (isAuth.value = isAuthData);
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
     * 取得使用者資料
     */
    async function getUserPorfile() {
        try {
            const { data }: any = await GetUserProfileAPI();
            // 判斷需要重設初始化密碼時
            if (data.data.initial_password) {
                return router.push({
                    name: "reset-password",
                    params: { slug: t("router.reset-password") },
                });
            }
            user.value = data.data;
            console.log("GetUserProfileAPI data =>", data);
            return data.data;
        } catch (err) {
            console.log("GetUserProfileAPI err =>", err);
        }
        return user.value;
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
        removeUser,
    };
});
