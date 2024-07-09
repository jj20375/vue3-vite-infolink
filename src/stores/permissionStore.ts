import { ref } from "vue";
import { defineStore } from "pinia";
import router from "@/router";
import dynamicRouter from "@/router/dynamicRouter";
import defaultRouter from "@/router/defaultRouter";
import type { RouteRecordRaw } from "vue-router";
export const usePermissionStore = defineStore("permissionStore", () => {
    /**
     * 路由權限資料
     */
    const permissionRouter = ref<Array<RouteRecordRaw>>([...defaultRouter, ...dynamicRouter]);
    const isHavePermissionRouter = ref(false);

    /**
     * api 取得路由權限資料
     */
    async function getPermissionRouter() {
        setTimeout(() => {
            // 模擬從 api 拿到的路由資料
            const getRouter = [
                {
                    path: "/user-panel/:slug",
                    name: "user-panel",
                    children: [
                        {
                            path: "info/:slug",
                            name: "user-info",
                        },
                        {
                            path: "change-password/:slug",
                            name: "user-change-password",
                        },
                        {
                            path: "record/:slug",
                            name: "user-record",
                        },
                    ],
                },
                {
                    path: "/report-download/:slug",
                    name: "report-download",
                },
                {
                    name: "data-factory",
                },
                {
                    path: "/contact/:slug",
                    name: "contact",
                },
            ];
            // 路由權限檢查 當 api 給予路由資料中 無法匹配 所需權限路由時 移除該路由
            permissionRouter.value = permissionRouter.value.filter((data: RouteRecordRaw) => {
                return getRouter.some((apiData) => {
                    // if (apiData.name === data.name) {
                    //     if (data.children) {
                    //         data.children.filter((childrenRouter: { name: string }) => {
                    //             if (apiData.children?.some((apiChildrenRouter) => apiChildrenRouter.name === childrenRouter.name)) {
                    //                 // router.removeRoute(childrenRouter.name);
                    //             }
                    //         });
                    //     }
                    //     router.removeRoute(data.name);
                    // }
                    // console.log("apiData.name, data.name", apiData.name, data.name);
                    return apiData.name !== data.name;
                });
            });
            isHavePermissionRouter.value = true;
            console.log("api work => ", permissionRouter.value, router.getRoutes());
        }, 1000);
    }
    return { permissionRouter, isHavePermissionRouter, getPermissionRouter };
});
