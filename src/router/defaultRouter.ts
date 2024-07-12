import LayoutMainLeftSidebar from "@/layouts/main/LayoutMainLeftSidebar";
import LayoutMainHeader from "@/layouts/main/LayoutMainHeader";
import IconHome from "@/components/icons/sidebar/IconHome.vue";
import HomeView from "@/views/home/HomeView.vue";
import NotFoundView from "@/views/NotFoundView";
import { markRaw } from "vue";
import type { RouteRecordRaw } from "vue-router";

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
            MainLeftSideBar: LayoutMainLeftSidebar,
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
