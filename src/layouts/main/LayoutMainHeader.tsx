import { RouterLink, useRouter, useRoute } from "vue-router";
// 使用者資料 store
import { useUserStore } from "@/stores/userStore";
// 初始化資料 store
import { useInitStore } from "@/stores/initStore";
// 其他方法 store
import { useUtilityStore } from "@/stores/utilityStore";
// 登出 icon
import IconLogout from "@/components/icons/IconLogout.vue";
// 手機版漢堡選單 icon
import IconMenu from "@/assets/img/icons/sidebar/menu.svg";
import { setStorage } from "@/services/localStorage";
// 語系選項
import langs from "@/i18n/langs";
import { useI18n } from "vue-i18n";
import { defineComponent, ref, computed } from "vue";
import style from "./layoutMain.module.scss";
import { AuthLogoutAPI } from "@/api/oauthAPI";

export default defineComponent({
    name: "LayoutMainHeader",
    props: {},
    emits: [],
    setup(props: any, { emit }: { emit: Function }) {
        const router = useRouter();
        const route = useRoute();
        const initStore = useInitStore();
        const utilityStore = useUtilityStore();
        const userStore = useUserStore();
        const initData: any = computed(() => initStore.initData);
        const { locale, t } = useI18n();
        const langsOptions = ref(langs);
        // 預設語系
        const currentLang = ref(locale.value);
        /**
         * 更換語系
         * @param lang 語系 code
         */
        async function changeLanguage(lang: string) {
            locale.value = lang;
            setStorage("lang", lang);
            document.title = t(`router.${route.name as string}`);
            setTimeout(async () => {
                await initStore.getInitData();
                if (route.meta.parent !== undefined) {
                    router.push({
                        name: route.name,
                        params: {
                            level2Slug: t(`router.${route.name as string}`),
                        },
                    });
                    return;
                }
                router.push({
                    name: route.name,
                    params: { slug: t(`router.${route.name as string}`) },
                });
            }, 200);
        }
        /**
         * 登出
         */
        async function logout() {
            try {
                await AuthLogoutAPI();
                userStore.removeUser();
                router.push({
                    name: "login",
                    params: { slug: t("router.login") },
                });
            } catch (err) {
                console.log("AuthLogoutAPI err =>", err);
            }
        }
        // 打開選單
        function openMenu() {
            utilityStore.setOpenMenu(true);
        }
        return () => {
            return (
                <header class="block z-[500] w-full mb-header2">
                    <div class="fixed w-full bg-black-900">
                        <nav class=" mx-[24px] xl:mx-[30px] flex justify-between items-center h-header2">
                            <div class="flex gap-4 items-center">
                                <RouterLink
                                    class="block mx-auto"
                                    to={{ name: "index" }}
                                >
                                    <img
                                        class=""
                                        src={initData.value.site.site_logo2}
                                    />
                                    {/* <IconLogo2 /> */}
                                </RouterLink>
                                <div class="relative flex w-[1px] h-[1rem] bg-black-700"></div>
                                <div class="text-white">
                                    {t("global.title")}
                                </div>
                            </div>
                            {/**  電腦版顯示語系及登出按鈕 */}
                            <div class="hidden xl:flex gap-3 items-center">
                                <el-form class="flex gap-2 w-[80px] header-form white">
                                    <el-form-item>
                                        <el-select
                                            class="!w-[80px]"
                                            v-model={currentLang.value}
                                            onChange={() =>
                                                changeLanguage(
                                                    currentLang.value
                                                )
                                            }
                                        >
                                            {Object.values(
                                                langsOptions.value
                                            ).map((langValue) => {
                                                return (
                                                    <el-option
                                                        class="text-center"
                                                        key={langValue.code}
                                                        value={
                                                            langValue["code"]
                                                        }
                                                        label={
                                                            langValue["name"]
                                                        }
                                                    ></el-option>
                                                );
                                            })}
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                                <div class="relative flex w-[1px] h-[1rem] bg-black-700"></div>
                                <button
                                    onClick={() => logout()}
                                    class="flex gap-2 p-2 items-center text-white text-[14px]"
                                >
                                    <IconLogout />
                                    {t("global.logout")}
                                </button>
                            </div>
                            {/**   手機版顯示收合選單  */}
                            <div
                                class="p-2 xl:hidden"
                                onClick={() => openMenu()}
                            >
                                <span class={style["svg-path"]}>
                                    <IconMenu />
                                </span>
                            </div>
                        </nav>
                    </div>
                </header>
            );
        };
    },
});
