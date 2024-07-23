<template>
    <div
        v-if="!useDefaultLayoutRouteNames.includes(route.name as string)"
        class="flex flex-col min-h-screen"
    >
        <RouterView name="MainHeader" />
        <img
            class="fixed object-cover w-full h-screen"
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
import { ref, onMounted } from "vue";
import { RouterView, useRouter, useRoute } from "vue-router";
import { setStorage } from "./services/localStorage";
import { useI18n } from "vue-i18n";
import DefaultBg from "@/components/bg/DefaultLayoutBg.vue";
import Footer from "@/layouts/main/LayoutMainFooter";
const router = useRouter();
const route = useRoute();
const i18n = useI18n();

// 使用預設樣板路由名稱(未登入狀態樣板)
const useDefaultLayoutRouteNames = ref([
    "login",
    "forgot-password",
    "reset-password",
]);

onMounted(async () => {
    setStorage("lang", i18n.locale.value);
    // 路由權限檢查 當 全部路由名稱無法匹配當下路由名稱時 導向
    if (router.getRoutes().some((router) => router.name !== route.name)) {
        // router.push({ name: "NotFound" });
        return;
    }
});
</script>
