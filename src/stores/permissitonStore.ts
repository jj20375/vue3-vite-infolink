import { ref } from "vue";
import { defineStore } from "pinia";
import router from "@/router";
import dynamicRouter from "@/router/dynamicRouter";
export const usePermissionStore = defineStore("permissionStore", () => {
    /**
     * 路由權限資料
     */
    const permissionRouter = ref(dynamicRouter);
    const isHavePermissionRouter = ref(false);

    /**
     * api 取得路由權限資料
     */
    async function getPermissionRouter() {
        setTimeout(() => {
            // 模擬從 api 拿到的路由資料
            const getRouter = [
                {
                    path: "/report-download",
                    name: "reportDownload",
                },
            ];
            // 路由權限檢查 當 api 給予路由資料中 無法匹配 所需權限路由時 移除該路由
            permissionRouter.value = permissionRouter.value.filter((data: { name: string }) => {
                return getRouter.some((apiData) => {
                    if (apiData.name === data.name) {
                        router.removeRoute(data.name);
                    }
                    return apiData.name !== data.name;
                });
            });
            isHavePermissionRouter.value = true;
            console.log("api work => ", permissionRouter.value, router.getRoutes());
        }, 1000);
    }
    return { permissionRouter, isHavePermissionRouter, getPermissionRouter };
});
