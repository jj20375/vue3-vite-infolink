import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from "vue-router";
import { useCounterStore } from "@/stores/counter";
import { usePermissionStore } from "@/stores/permissionStore";
import dynamicRouter from "@/router/dynamicRouter";
import defaultRouter from "@/router/defaultRouter";
import { storeToRefs } from "pinia";
import LayoutMainLeftSidebar from "@/layouts/main/LayoutMainLeftSidebar";
import LayoutMainHeader from "@/layouts/main/LayoutMainHeader";
import IconHome from "@/assets/img/icons/sidebar/home.svg";
const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        return { top: 0 };
    },
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...defaultRouter, ...dynamicRouter],
});

// 路由守衛 加上進入頁面前判斷是否有登入 沒登入則導向登入頁面
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    const permissionStore = usePermissionStore();
    const { isHavePermissionRouter } = storeToRefs(permissionStore);
    if (!isHavePermissionRouter.value) {
        await permissionStore.getPermissionRouter();
    }

    // 取得 localstorage token 判斷有 token 情況下 代表有登入
    const token = localStorage.getItem("token");
    // 有登入情況下
    if (to.name === "auth-login" && token) {
        return {
            name: "home",
            params: { slug: "會員專區" },
        };
    }

    if (to.meta.requiresAuth && !token) {
        return {
            name: "auth-login",
            params: { slug: "會員登入" },
            // 保存我们所在的位置，以便以后再来
            query: { redirect: to.fullPath },
        };
    }
    return true;
});
router.afterEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {});

export default router;
