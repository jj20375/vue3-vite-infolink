import IconMember from "@/components/icons/IconMember.vue";
import IconDownload from "@/components/icons/sidebar/IconDownload.vue";
import IconCloud from "@/components/icons/sidebar/IconCloud.vue";
import IconContact from "@/components/icons/sidebar/IconContact.vue";
import LayoutMainLeftSidebar from "@/layouts/main/LayoutMainLeftSidebar";
import LayoutMainHeader from "@/layouts/main/LayoutMainHeader";
import { markRaw } from "vue";
import type { RouteRecordRaw } from "vue-router";
import LayoutDefaultHeader from "@/layouts/default/LayoutDefaultHeader";
import LayoutDefaultFooter from "@/layouts/default/LayoutDefaultFooter";
const router: Array<RouteRecordRaw> = [
    {
        path: "/user-panel",
        name: "user-panel",
        meta: {
            icon: markRaw(IconMember),
            menu: true,
            sort: 2,
            requiresAuth: true,
        },
        children: [
            {
                path: "info/:level2Slug/:chapters*",
                name: "user-info",
                meta: {
                    // menu: true,
                    sort: 1,
                    parent: "user-panel",
                    requiresAuth: true,
                },
                components: {
                    default: () =>
                        import("@/views/user-panel/user-info/UserInfoView"),
                    MainLeftSideBar: LayoutMainLeftSidebar,
                    MainHeader: LayoutMainHeader,
                },
            },
            {
                path: "change-password/:level2Slug",
                name: "user-change-password",
                meta: {
                    // menu: true,
                    sort: 2,
                    parent: "user-panel",
                    requiresAuth: true,
                },
                components: {
                    default: () =>
                        import(
                            "@/views/user-panel/user-change-password/UserChangePasswordView"
                        ),
                    MainLeftSideBar: LayoutMainLeftSidebar,
                    MainHeader: LayoutMainHeader,
                },
            },
            {
                path: "contract/:level2Slug/:chapters*",
                name: "user-contract",
                meta: {
                    // menu: true,
                    sort: 3,
                    parent: "user-panel",
                    requiresAuth: true,
                },
                components: {
                    default: () =>
                        import(
                            "@/views/user-panel/user-contract/UserContractView"
                        ),
                    MainLeftSideBar: LayoutMainLeftSidebar,
                    MainHeader: LayoutMainHeader,
                },
            },
        ],
    },
    {
        path: "/report-download/:slug/:chapters*",
        name: "report-download",
        meta: {
            icon: markRaw(IconDownload),
            menu: true,
            sort: 3,
            requiresAuth: true,
        },
        components: {
            default: () => import("@/views/report/ReportDownloadView"),
            MainLeftSideBar: LayoutMainLeftSidebar,
            MainHeader: LayoutMainHeader,
        },
    },
    {
        path: "/report/:id/:slug",
        name: "report-detail",
        meta: {
            menu: false,
            sort: 3,
            requiresAuth: true,
        },
        components: {
            default: () => import("@/views/report/ReportDownloadView"),
            MainLeftSideBar: LayoutMainLeftSidebar,
            MainHeader: LayoutMainHeader,
        },
    },
    {
        path: "/report-download-detail/:id/:slug",
        name: "report-download-detail",
        meta: {
            menu: false,
            requiresAuth: true,
        },
        components: {
            default: () => import("@/views/report/ReportDetailView"),
            MainLeftSideBar: LayoutMainLeftSidebar,
            MainHeader: LayoutMainHeader,
        },
    },
    {
        path: "/data-factory/:slug",
        name: "data-factory",
        meta: {
            icon: markRaw(IconCloud),
            menu: true,
            sort: 4,
            requiresAuth: true,
            link: true,
        },
        component: () => import("@/views/NotFoundView"),
    },
    {
        path: "/contact/:slug",
        name: "contact",
        meta: {
            icon: markRaw(IconContact),
            menu: true,
            sort: 5,
            requiresAuth: true,
        },
        components: {
            default: () => import("@/views/contact/ContactView"),
            MainLeftSideBar: LayoutMainLeftSidebar,
            MainHeader: LayoutMainHeader,
        },
    },
    {
        path: "/contact-success/:slug",
        name: "contact-success",
        meta: {
            menu: false,
            sort: 6,
            requiresAuth: true,
        },
        components: {
            default: () => import("@/views/contact/ContactSuccessView"),
            DefaultHeader: LayoutDefaultHeader,
            DefaultFooter: LayoutDefaultFooter,
        },
    },
];

export default router;
