import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from "vue-router";
import HomeView from "../views/HomeView.vue";
import NotFoundView from "@/views/NotFoundView";
import { useCounterStore } from "@/stores/counter";
import { usePermissionStore } from "@/stores/permissitonStore";
import dynamicRouter from "@/router/dynamicRouter";
import { storeToRefs } from "pinia";
import LayoutMainLeftSidebar from "@/layouts/main/LayoutMainLeftSidebar";
const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        // 始终滚动到顶部
        return { top: 0 };
    },
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            components: {
                default: HomeView,
                MainLeftSideBar: LayoutMainLeftSidebar,
            },
        },
        {
            path: "/about",
            name: "about",
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import("../views/AboutView.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "/auth/login/:slug",
            name: "login",
            components: {
                default: async () => await import("@/views/auth/LoginView"),
                MainLeftSideBar: LayoutMainLeftSidebar,
            },
        },
        {
            path: "/404",
            name: "404",
            component: NotFoundView,
        },
        // 将匹配所有内容并将其放在 `route.params.pathMatch` 下
        { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFoundView, redirect: { name: "404" } },
        ...dynamicRouter,
    ],
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
    if (to.name === "login" && token) {
        return {
            name: "home",
        };
    }

    if (to.meta.requiresAuth && !token) {
        return {
            name: "login",
            params: { slug: "會員登入" },
            // 保存我们所在的位置，以便以后再来
            query: { redirect: to.fullPath },
        };
    }
});
router.afterEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {});

export default router;
