import LayoutMainLeftSidebar from "@/layouts/main/LayoutMainLeftSidebar";
import LayoutMainHeader from "@/layouts/main/LayoutMainHeader";
import IconHome from "@/components/icons/sidebar/IconHome.vue";
import HomeView from "@/views/home/HomeView.vue";
import NotFoundView from "@/views/NotFoundView";
import { markRaw } from "vue";
import type { RouteRecordRaw } from "vue-router";
import LayoutDefaultFooter from "@/layouts/default/LayoutDefaultFooter";
import LayoutDefaultHeader from "@/layouts/default/LayoutDefaultHeader";

const router: Array<RouteRecordRaw> = [
    {
        path: `/`,
        name: "index",
        meta: {},
        redirect: () => {
            return { name: `home`, params: { slug: "會員專區" } };
        },
    },
    {
        path: `/home/:slug`,
        name: "home",
        meta: {
            icon: markRaw(IconHome),
            menu: true,
            sort: 1,
            requiresAuth: true,
        },
        components: {
            default: HomeView,
            MainLeftSideBar: LayoutMainLeftSidebar,
            MainHeader: LayoutMainHeader,
        },
    },
    {
        path: "/auth/login/:slug",
        name: "login",
        meta: {},
        components: {
            default: async () => await import("@/views/auth/LoginView"),
            DefaultHeader: LayoutDefaultHeader,
            DefaultFooter: LayoutDefaultFooter,
        },
    },
    {
        path: "/auth/forgot-password/:slug",
        name: "forgot-password",
        meta: {},
        components: {
            default: async () => await import("@/views/auth/forgot-password/ForgotPasswordView"),
            DefaultHeader: LayoutDefaultHeader,
            DefaultFooter: LayoutDefaultFooter,
        },
    },
    {
        path: "/auth/reset-password/:slug",
        name: "reset-password",
        meta: {},
        components: {
            default: async () => await import("@/views/auth/reset-password/ResetPasswordView"),
            DefaultHeader: LayoutDefaultHeader,
            DefaultFooter: LayoutDefaultFooter,
        },
    },
    {
        path: "/auth/verify-email/:slug",
        name: "verify-email",
        meta: {},
        components: {
            default: async () => await import("@/views/auth/verify-email/VerifyEmailView"),
            DefaultHeader: LayoutDefaultHeader,
            DefaultFooter: LayoutDefaultFooter,
        },
    },
    {
        path: "/404",
        name: "404",
        meta: {},
        component: NotFoundView,
    },
    // 将匹配所有内容并将其放在 `route.params.pathMatch` 下
    { path: "/:pathMatch(.*)*", name: "NotFound", meta: {}, component: NotFoundView, redirect: { name: "404" } },
];
export default router;
