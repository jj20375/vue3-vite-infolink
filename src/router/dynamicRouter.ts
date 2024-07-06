import IconMember from "@/assets/img/icons/member.svg";
import IconDownload from "@/assets/img/icons/sidebar/download.svg";
import IconCloud from "@/assets/img/icons/sidebar/cloud.svg";
import IconContact from "@/assets/img/icons/sidebar/contact.svg";
import LayoutMainLeftSidebar from "@/layouts/main/LayoutMainLeftSidebar";
import LayoutMainHeader from "@/layouts/main/LayoutMainHeader";
import { markRaw } from "vue";

export default [
    {
        path: "/user-panel/:slug",
        name: "user-panel",
        meta: {
            icon: markRaw(IconMember),
            menu: true,
            sort: 2,
        },
        children: [
            {
                path: "info/:level2Slug",
                name: "user-info",
                meta: {
                    // menu: true,
                    sort: 1,
                    parent: "user-panel",
                },
                components: {
                    default: () => import("@/views/report/ReportDownloadView"),
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
            rort: 3,
        },
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
            rort: 4,
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
            rort: 5,
        },
        components: {
            default: () => import("@/views/report/ReportDownloadView"),
            MainLeftSideBar: LayoutMainLeftSidebar,
            MainHeader: LayoutMainHeader,
        },
    },
];
