import IconMember from "@/components/icons/IconMember.vue";
import IconDownload from "@/components/icons/sidebar/IconDownload.vue";
import IconCloud from "@/components/icons/sidebar/IconCloud.vue";
import IconContact from "@/components/icons/sidebar/IconContact.vue";
import LayoutMainLeftSidebar from "@/layouts/main/LayoutMainLeftSidebar";
import LayoutMainHeader from "@/layouts/main/LayoutMainHeader";
import { markRaw } from "vue";
import type { RouteRecordRaw } from "vue-router";
const router: Array<RouteRecordRaw> = [
    {
        path: "/user-panel",
        name: "user-panel",
        meta: {
            icon: markRaw(IconMember),
            menu: true,
            sort: 2,
        },
        children: [
            {
                path: "info/:level2Slug/:chapters*",
                name: "user-info",
                meta: {
                    // menu: true,
                    sort: 1,
                    parent: "user-panel",
                },
                components: {
                    default: () => import("@/views/user-panel/UserInfoView"),
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
                },
                components: {
                    default: () => import("@/views/report/ReportDownloadView"),
                    MainLeftSideBar: LayoutMainLeftSidebar,
                    MainHeader: LayoutMainHeader,
                },
            },
            {
                path: "record/:level2Slug",
                name: "user-record",
                meta: {
                    // menu: true,
                    sort: 3,
                    parent: "user-panel",
                },
                components: {
                    default: () => import("@/views/report/ReportDownloadView"),
                    MainLeftSideBar: LayoutMainLeftSidebar,
                    MainHeader: LayoutMainHeader,
                },
            },
        ],
    },
    {
        path: "/report-download/:slug",
        name: "report-download",
        meta: {
            icon: markRaw(IconDownload),
            menu: true,
            sort: 3,
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
        meta: {},
        components: {
            default: () => import("@/views/report/ReportDownloadView"),
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
            link: "https://www.google.com.tw/webhp?hl=zh-TW",
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
        },
        components: {
            default: () => import("@/views/report/ReportDownloadView"),
            MainLeftSideBar: LayoutMainLeftSidebar,
            MainHeader: LayoutMainHeader,
        },
    },
];

export default router;
