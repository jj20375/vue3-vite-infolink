import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { usePermissionStore } from "@/stores/permissitonStore";
import { storeToRefs } from "pinia";
import { computed, onMounted } from "vue";

export default {
    name: "LoginView",
    props: {},
    emits: [],
    setup(props: any, { emit }: { emit: string }) {
        const permissionStore = usePermissionStore();
        const { permissionRouter } = storeToRefs(permissionStore);
        const permissionRouterComputed = computed(() => permissionStore.permissionRouter);

        onMounted(async () => {
            await permissionStore.getPermissionRouter();
            console.log("permissionStore =>", permissionRouter.value, permissionRouterComputed.value);
        });
        console.log("useRouter =>", useRouter());

        onBeforeRouteUpdate(async (to, from, next) => {});

        return () => (
            <section class="h-full container flex justify-center items-center">
                <div class="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
                    <h1>登入頁</h1>
                </div>
            </section>
        );
    },
};
