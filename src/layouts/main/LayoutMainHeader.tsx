import { RouterLink, useRouter, useRoute } from "vue-router";
// 初始化資料 store
import { useInitStore } from "@/stores/initStore";
// 其他方法 store
import { useUtilityStore } from "@/stores/utilityStore";
// 登出 icon
import IconLogout from "@/assets/img/icons/logout.svg";
// 手機版漢堡選單 icon
import IconMenu from "@/assets/img/icons/sidebar/menu.svg";
import { setStorage } from "@/services/localStorage";
// 語系檔
import langs from "@/i18n/langs";
import { useI18n } from "vue-i18n";
import { ref, computed } from "vue";
import style from "./layoutMain.module.scss";
import IconLogo2 from "@/assets/img/logo/logo-2.svg";
export default {
    name: "LayoutMainHeader",
    components: { IconLogo2 },
    props: {},
    emits: [],
    setup(props: any, { emit }: { emit: Function }) {
        const router = useRouter();
        const route = useRoute();
        const initStore = useInitStore();
        const utilityStore = useUtilityStore();
        const initData: any = computed(() => initStore.initData);
        const { locale, t } = useI18n();
        const langsOptions = ref(langs);
        const currentLang = ref(locale.value);
        /**
         * 更換語系
         * @param lang 語系 code
         */
        function changeLanguage(lang: string) {
            locale.value = lang;
            setStorage("lang", lang);
            router.push({ name: route.name, params: { slug: t(`router.${route.name as string}`) } });
        }
        /**
         * 登出
         */
        function logout() {
            router.push({ name: "login", params: { slug: "會員登入" } });
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
                                <RouterLink class="block mx-auto" to={{ name: "index" }}>
                                    <IconLogo2 />
                                    {/* <img class="" src={initData.value.site.site_logo2

                                    } alt={import.meta.env.WEB_SITE} /> */}
                                </RouterLink>
                                <div class="relative flex w-[1px] h-[1rem] bg-black-700"></div>
                                <div class="text-white">報告下載專區</div>
                            </div>
                            {/**  電腦版顯示語系及登出按鈕 */}
                            <div class="hidden xl:flex gap-3 items-center">
                                <el-form class="flex gap-2 w-[80px] header-form white">
                                    <el-form-item>
                                        <el-select class="!w-[80px]" v-model={currentLang.value} onChange={() => changeLanguage(currentLang.value)}>
                                            {Object.values(langsOptions.value).map((langValue) => {
                                                return <el-option class="text-center" key={langValue.code} value={langValue["code"]} label={langValue["name"]}></el-option>;
                                            })}
                                        </el-select>
                                    </el-form-item>
                                </el-form>
                                <div class="relative flex w-[1px] h-[1rem] bg-black-700"></div>
                                <button onClick={() => logout()} class="flex gap-2 p-2 items-center text-white text-[14px]">
                                    <IconLogout />
                                    登出
                                </button>
                            </div>
                            {/**   手機版顯示收合選單  */}
                            <div class="p-2 xl:hidden" onClick={() => openMenu()}>
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
};
