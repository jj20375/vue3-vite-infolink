import {
    createRouter,
    createWebHistory,
    type NavigationGuardNext,
    type RouteLocationNormalized,
} from "vue-router";
import { nextTick } from "vue";
import { usePermissionStore } from "@/stores/permissionStore";
import { useInitStore } from "@/stores/initStore";
import { useUserStore } from "@/stores/userStore";
import dynamicRouter from "@/router/dynamicRouter";
import defaultRouter from "@/router/defaultRouter";
import { storeToRefs } from "pinia";
import { ElLoading } from "element-plus";
import enUS from "@/i18n/locales/en.json";
import zhTW from "@/i18n/locales/tw.json";
import zhCN from "@/i18n/locales/cn.json";
import { getStorage, setStorage } from "@/services/localStorage";
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

const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        return { top: 0 };
    },
    history: createWebHistory("#"),
    routes: [...defaultRouter, ...dynamicRouter],
});

// 路由守衛 加上進入頁面前判斷是否有登入 沒登入則導向登入頁面
router.beforeEach(
    async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
        const initStore = useInitStore();
        const permissionStore = usePermissionStore();
        const userStore = useUserStore();
        const { isHavePermissionRouter } = storeToRefs(permissionStore);
        const { isGetInitData } = storeToRefs(initStore);
        const { initData } = storeToRefs(initStore);
        const { isAuth } = storeToRefs(userStore);
        // 取得 localstorage token 判斷有 token 情況下 代表有登入
        const token = localStorage.getItem("token");
        const loading = ElLoading.service({
            lock: true,
            text: "Loading...",
            background: "rgba(0, 0, 0, 0.8)",
        });

        if (!isHavePermissionRouter.value) {
            await permissionStore.getPermissionRouter();
        }
        // 取得初始化資料
        if (!isGetInitData.value) {
            await initStore.getInitData();
            // 判斷是維護模式時
            if (initData.value.site.maintenance_mode) {
                console.log(
                    "initData.value.site.maintenance_mode =>",
                    initData.value.site.maintenance_mode
                );
                // 且有 hash 值
                if (to.query.hash) {
                    // 將 hash 值 存在 localStorage 用來以防重新整理時 因為維護模式狀態下 又導頁去維護頁
                    setStorage("maintenanceHashData", to.query.hash);
                }
                // 且有 iv 值
                if (to.query.rand) {
                    // 將 iv 值 存在 localStorage 用來以防重新整理時 因為維護模式狀態下 又導頁去維護頁
                    setStorage("maintenanceRandData", to.query.rand);
                }
                // 取得 localstorage 維護狀態 hash 值
                const hashData = getStorage("maintenanceHashData");
                // 取得 localstorage 維護狀態 iv 值
                const randData = getStorage("maintenanceRandData");
                //  在維護模式下  localstorage 有 hash 值 與 iv 值時 執行解密動作
                if (!isEmpty(hashData) && !isEmpty(randData)) {
                    // 解密函示 如果有值 且為 1 代表解密成功
                    const decryptedData = await decryptData({
                        hashData,
                        randData,
                    });
                    console.log("decryptedData =>", decryptedData);
                    // 判斷解密不等於 1 時 導頁去維護頁
                    if (decryptedData !== "1") {
                        return {
                            name: "maintenance",
                            params: {
                                slug: i18nData()["router"]["maintenance"],
                            },
                        };
                    } else {
                        return {
                            name: "home",
                            params: {
                                slug: i18nData()["router"]["home"],
                            },
                        };
                    }
                }
                return {
                    name: "maintenance",
                    params: {
                        slug: i18nData()["router"]["maintenance"],
                    },
                };
            }
        }
        // 取得使用者資料
        if (token && !isAuth.value) {
            await userStore.getUserPorfile();
            await userStore.getSubAccounts();
        }

        // 判斷非重設密碼畫面時觸發
        if (to.name !== "reset-password") {
            // 判斷需要設定初始化密碼時 導頁去重設密碼畫面
            if (userStore.user.needSettingPassword) {
                loading.close();
                return {
                    name: "reset-password",
                    params: { slug: i18nData()["router"]["reset-password"] },
                };
            }
        }
        // 判斷非個人資料設定畫面 且 需要設定個人資料情況時 讓使用者導頁去個人資料頁
        if (to.name !== "user-info") {
            // 判斷需要輸入個人資料時 且無需設定初始化密碼時 導頁去個人資料設定頁
            if (
                userStore.user.needSettingProfile &&
                !userStore.user.needSettingPassword
            ) {
                loading.close();
                return {
                    name: "user-info",
                    params: { level2Slug: i18nData()["router"]["user-info"] },
                };
            }
        }

        loading.close();
        // 有登入情況下
        if (to.name === "login" && token) {
            return {
                name: "home",
                params: { slug: i18nData()["router"]["home"] },
            };
        }

        if (to.meta.requiresAuth && !token) {
            return {
                name: "login",
                params: { slug: i18nData()["router"]["login"] },
                // 保存我们所在的位置，以便返回 token 失效前查看的畫面
                query: { redirect: to.fullPath },
            };
        }
        return true;
    }
);
router.afterEach(
    async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
        const initStore = useInitStore();
        nextTick(() => {
            if (Object.keys(initStore.initData.site).length > 0) {
                if (initStore.initData.site.meta_title) {
                    document.title =
                        initStore.initData.site.meta_title +
                        "-" +
                        i18nData()["router"][to.name!];
                    document
                        .querySelector('meta[property="og:title"]')!
                        .setAttribute(
                            "content",
                            initStore.initData.site.meta_title +
                                "-" +
                                i18nData()["router"][to.name!]
                        );
                } else {
                    document.title =
                        i18nData()["router"][to.name!] ||
                        import.meta.env.VITE_WEB_NAME;
                }
                if (!isEmpty(initStore.initData.site.meta_description)) {
                    document
                        .querySelector('meta[name="description"]')!
                        .setAttribute(
                            "content",
                            initStore.initData.site.meta_description
                        );
                    document
                        .querySelector('meta[property="og:description"]')!
                        .setAttribute(
                            "content",
                            initStore.initData.site.meta_description
                        );
                }
                if (!isEmpty(initStore.initData.site.meta_keywords)) {
                    document
                        .querySelector('meta[name="keywords"]')!
                        .setAttribute(
                            "content",
                            initStore.initData.site.meta_keywords.join(", ")
                        );
                    document
                        .querySelector('meta[property="og:keywords"]')!
                        .setAttribute(
                            "content",
                            initStore.initData.site.meta_keywords.join(",")
                        );
                }
            } else {
                document.title =
                    i18nData()["router"][to.name!] ||
                    import.meta.env.VITE_WEB_NAME;
            }
        });
    }
);

export default router;
