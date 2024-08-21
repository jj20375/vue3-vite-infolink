<template>
    <div
        v-if="!useDefaultLayoutRouteNames.includes(route.name as string)"
        class="flex flex-col min-h-screen"
    >
        <RouterView name="MainHeader" />
        <img
            class="fixed object-cover w-full h-screen opacity-[0.3]"
            src="/img/layout/bg.svg"
        />
        <section class="flex">
            <RouterView name="MainLeftSideBar" />
            <div
                class="relative flex flex-col justify-between xl:flex-1 w-full min-h-[calc(100vh-72px)]"
            >
                <RouterView />
                <Footer />
            </div>
        </section>
    </div>
    <div v-else>
        <div class="flex flex-col justify-between min-h-screen">
            <RouterView name="DefaultHeader" />
            <RouterView />
            <RouterView name="DefaultFooter" />
        </div>
        <DefaultBg class="absolute bottom-0 left-0 w-[120px] sm:w-[180px]" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import {
    RouterView,
    useRouter,
    useRoute,
    onBeforeRouteUpdate,
} from "vue-router";
import { setStorage } from "./services/localStorage";
import { useI18n } from "vue-i18n";
import { useUserStore } from "./stores/userStore";
import DefaultBg from "@/components/bg/DefaultLayoutBg.vue";
import Footer from "@/layouts/main/LayoutMainFooter";
const router = useRouter();
const route = useRoute();
const i18n = useI18n();
const userStore = useUserStore();
const user = computed(() => userStore.user);

// 使用預設樣板路由名稱(未登入狀態樣板)
const useDefaultLayoutRouteNames = ref([
    "login",
    "contact-success",
    "forgot-password",
    "reset-password",
    "maintenance",
    "404",
    "NotFound",
]);

watch(
    () => route.name,
    (val) => {
        // 路由權限檢查 當 全部路由名稱無法匹配當下路由名稱時 導向
        if (
            val !== undefined &&
            router.getRoutes().find((router) => router.name === val) ===
                undefined
        ) {
            router.push({ name: "NotFound" });
            return;
        }
    }
);

watch(
    () => user.value,
    (val) => {
        // 判斷需要重設初始化密碼時導頁去設定密碼
        if (val.needSettingPassword) {
            router.push({
                name: "reset-password",
                params: {
                    slug: i18n.t("router.reset-password"),
                },
            });
            return;
        }
        // 判斷需要設定基本資料時導頁去會員資料管理
        if (val.needSettingProfile) {
            router.push({
                name: "user-info",
                params: { level2Slug: i18n.t("router.user-info") },
            });
            return;
        }
    }
);
onMounted(async () => {
    setStorage("lang", i18n.locale.value);
});
</script>
