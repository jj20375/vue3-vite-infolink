<template>
    <div class="flex flex-col min-h-screen">
        <RouterView name="MainHeader" />
        <section class="flex">
            <RouterView name="MainLeftSideBar" />
            <div class="relative flex flex-col justify-between xl:flex-1 w-full min-h-[calc(100vh-72px)]">
                <div class="absolute top-0 left-0 w-full h-full opacity-20 z-[-1]" style="background-image: url('img/layout/bg.svg'); background-attachment: fixed"></div>
                {{ $t("welcome") }}
                <RouterView />
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView, useRouter, useRoute } from "vue-router";
import { setStorage } from "./services/localStorage";
import { useI18n } from "vue-i18n";
const router = useRouter();
const route = useRoute();
const i18n = useI18n();
onMounted(() => {
    setStorage("lang", i18n.locale.value);
    // 路由權限檢查 當 全部路由名稱無法匹配當下路由名稱時 導向
    if (router.getRoutes().some((router) => router.name !== route.name)) {
        // router.push({ name: "NotFound" });
        return;
    }
});
</script>
