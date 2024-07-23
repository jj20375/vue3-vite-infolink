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

const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        return { top: 0 };
    },
    history: createWebHistory(import.meta.env.BASE_URL),
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
        }
        // 取得使用者資料
        if (token && !isAuth.value) {
            await userStore.getUserPorfile();
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
        nextTick(() => {
            document.title =
                i18nData()["router"][to.name!] || import.meta.env.VITE_WEB_NAME;
        });
    }
);

export default router;
