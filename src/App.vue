<template>
    <div class="flex flex-col min-h-screen">
        <header>
            <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

            <div class="wrapper">
                <!-- <HelloWorld msg="You did it!" /> -->

                <nav>
                    <RouterLink to="/">Home</RouterLink>
                    <RouterLink to="/about">About</RouterLink>
                    <RouterLink to="/report-download">report-download</RouterLink>
                    <button v-for="lang in langs" :key="lang.code" @click="changeLanguage(lang.code)">
                        {{ lang.name }}
                    </button>
                </nav>
            </div>
        </header>
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
import { RouterLink, RouterView, useRouter, useRoute } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";
import { useI18n } from "vue-i18n";
import langs from "@/i18n/langs";
const router = useRouter();
const route = useRoute();
const i18n = useI18n();
/**
 * 更換語系
 * @param lang 語系 code
 */
function changeLanguage(lang: string) {
    i18n.locale.value = lang;
}
onMounted(() => {
    // 路由權限檢查 當 全部路由名稱無法匹配當下路由名稱時 導向
    if (router.getRoutes().some((router) => router.name !== route.name)) {
        // router.push({ name: "NotFound" });
        return;
    }
});
</script>
