import { defineComponent, ref, computed } from "vue";
import { useRoute, useRouter, RouterLink } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { useInitStore } from "@/stores/initStore";
import { useUserStore } from "@/stores/userStore";
import { useUtilityStore } from "@/stores/utilityStore";
import { usePermissionStore } from "@/stores/permissionStore";
import { useI18n } from "vue-i18n";
import IconArrowLeftDouble from "@/components/icons/IconArrowLeftDouble.vue";
import IconArrowRight from "@/components/icons/IconArrowRight.vue";
import IconCollapse from "@/assets/img/icons/sidebar/menu-collapse.svg";
import IconLinkedin from "@/assets/img/icons/medias/linkedin.svg";
import IconTwitter from "@/assets/img/icons/medias/twitter.svg";
import IconWechat from "@/assets/img/icons/medias/wechat.svg";
import IconClose from "@/components/icons/IconClose.vue";
import IconLink from "@/components/icons/IconLink.vue";
import IconLogout from "@/components/icons/IconLogout.vue";
import { Vue3SlideUpDown } from "vue3-slide-up-down";
import { useWindowResize } from "@/hooks/windowResize";
import { setStorage } from "@/services/localStorage";
import { AuthLogoutAPI } from "@/api/oauthAPI";
// 語系選項
import langs from "@/i18n/langs";

export default defineComponent({
    name: "LayoutMainLeftSideBar",
    props: {},
    emits: ["update:openMenu"],
    setup(props, { emit }) {
        const route = useRoute();
        const router = useRouter();
        const { isDesktop } = useWindowResize();
        const userStore = useUserStore();
        const initStore = useInitStore();
        const permissionStore = usePermissionStore();
        const { locale, t } = useI18n();

        const utilityStore = useUtilityStore();
        const user = computed(() => userStore.user);
        const initData = computed(() => initStore.initData);
        const openMenu = computed(() => utilityStore.openMenu);
        // 權限路由
        const permissionRouter = computed<Array<RouteRecordRaw>>(() => permissionStore.permissionRouter);

        const expandMode = ref(true);
        const setExpandMode = () => {
            expandMode.value = !expandMode.value;
            if (!expandMode.value) {
                Object.keys(collapseMap.value).forEach((key: string) => {
                    collapseMap.value[key] = false;
                });
            }
        };

        const collapseMap = ref<any>({});
        const setCollapse = (idx: number) => {
            if (collapseMap.value[idx]) {
                collapseMap.value[idx] = false;
            } else {
                Object.keys(collapseMap.value).forEach((key) => {
                    collapseMap.value[parseInt(key)] = false;
                });
                collapseMap.value[idx] = true;
            }
        };

        const isActiveItem = (item: any, idx: number) => {
            return route.name === item?.path?.name || (item.children && item.children.some((child: any) => route.name === child.path.name)) || collapseMap.value[idx];
        };

        // 路由選單
        const menuList = computed<Array<RouteRecordRaw>>(() => {
            console.log("permissionRouter =>", permissionRouter.value);
            if (permissionRouter.value.length > 0) {
                const rawMenuList = permissionRouter.value.filter((data) => {
                    if (data.children) {
                        data.children = data.children.filter((children: any) => !children.meta.menu);
                    }
                    return data.meta!.menu;
                });
                console.log("rawMenuList ==>", rawMenuList);
                return rawMenuList;
            }
            return [];
        });

        // 聯絡資料
        const contact = computed(() => {
            const arr: { iconName: any; alt: string; url?: string }[] = [];
            if (initData.value.site.social_linkedin) {
                arr.push({
                    iconName: IconLinkedin,
                    alt: "linkedin",
                    url: initData.value.site.social_linkedin,
                });
            }
            if (initData.value.site.social_twitter) {
                arr.push({
                    iconName: IconTwitter,
                    alt: "x",
                    url: initData.value.site.social_twitter,
                });
            }
            if (initData.value.site.social_wechat) {
                arr.push({
                    iconName: IconWechat,
                    alt: "wechat",
                    url: initData.value.site.social_wechat,
                });
            }
            return {
                icons: arr,
            };
        });

        const toSocialMedia = (socialMedia: { url: string | URL | undefined }) => {
            if (socialMedia.url) {
                window.open(socialMedia.url, "_blank");
            }
        };

        const closeMenu = () => {
            utilityStore.setOpenMenu(false);
        };

        // 預設語系
        const currentLang = ref(locale.value);

        const langsOptions = ref(langs);

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
        async function logout() {
            try {
                await AuthLogoutAPI();
                router.push({ name: "login", params: { slug: t("router.login") } });
            } catch (err) {
                console.log("AuthLogoutAPI err =>", err);
            }
        }

        return () => (
            <div
                class={[
                    "fixed xl:sticky top-0 xl:top-[72px] -translate-x-full xl:translate-x-0 bg-white h-screen xl:h-[calc(100vh-72px)] w-full xl:w-[300px] xl:border-r border-black-100 duration-300 transition-all overflow-x-hidden z-[1000]",
                    { "!w-[76px]": !expandMode.value && isDesktop.value, "!translate-x-0": openMenu.value },
                ]}
            >
                <div class="w-full xl:w-[300px] h-full flex flex-col justify-between">
                    <div>
                        {/* 手機版收合選單 */}
                        <div class="relative px-6 py-6 xl:hidden sm:px-7">
                            <button onClick={() => closeMenu()} class="block w-full">
                                <IconClose class="ml-auto !w-[20px] !h-[20px]" />
                            </button>
                        </div>
                        <div class={["flex justify-between px-6 py-6 font-medium sm:px-7", { "hidden opacity-0": !expandMode.value && isDesktop.value }]}>
                            {t('welcome', {name: user.value.name})}
                            <button onClick={() => setExpandMode()} class="hidden xl:block !w-6 !h-6 text-black-500 cursor-pointer hover:text-black-900 duration-300 transition-all">
                                <IconArrowLeftDouble />
                            </button>
                        </div>
                        <div class={["px-6 sm:px-7 py-[27px] text-black-500 hover:text-black-900 duration-300 transition-all cursor-pointer", { hidden: expandMode.value || !isDesktop.value }]} onClick={() => setExpandMode()}>
                            <button class="!w-[18px] !h-[18px]">
                                <IconCollapse />
                            </button>
                        </div>
                        <div>
                            {menuList.value.map((item, idx) => (
                                <div key={idx}>
                                    {item.path && !item.meta!.link ? (
                                        <button
                                            class="w-full"
                                            onClick={() => {
                                                if (!item.meta!.link) setCollapse(idx);
                                                if (!expandMode.value) setExpandMode();
                                            }}
                                        >
                                            {item.path && !item.children && (
                                                <RouterLink
                                                    to={{ name: item.name, params: { slug: t(`router.${item.name as string}`) } }}
                                                    class={["relative block px-6 sm:px-7 py-4 text-[16px] text-black-500 hover:text-black-900 duration-300 transition-all", { "font-medium text-black-900": collapseMap.value[idx] }]}
                                                    activeClass="font-medium text-black-900 before:absolute before:bg-yellow-900 before:top-0 before:left-0 before:h-full before:w-[4px] before:rounded-r-2xl fill-black-500"
                                                    exactActiveClass="font-medium text-black-900 before:absolute before:bg-yellow-900 before:top-0 before:left-0 before:h-full before:w-[4px] before:rounded-r-2xl fill-black-500"
                                                >
                                                    <div class="flex items-center justify-between gap-3">
                                                        <item.meta.icon class={["!w-[18px] !h-[18px]", isActiveItem(item, idx) ? "text-black-900" : "text-black-500"]} />
                                                        <span class={["text-left flex-1", { "opacity-0": !expandMode.value && isDesktop.value }]}>{t(`router.${item.name as string}`)}</span>
                                                    </div>
                                                </RouterLink>
                                            )}
                                            {item.children && (
                                                <div class={["relative block px-6 sm:px-7 py-4 text-[16px] text-black-500 hover:text-black-900 duration-300 transition-all"]}>
                                                    <div class="flex items-center justify-between gap-3">
                                                        <item.meta.icon class={["!w-[18px] !h-[18px]", isActiveItem(item, idx) ? "text-black-900" : "text-black-500"]} />
                                                        <span class={["flex-1 text-left", { "opacity-0": !expandMode.value && isDesktop.value }]}>{t(`router.${item.name as string}`)}</span>
                                                        <div class={["", { "opacity-0": !expandMode.value && isDesktop.value }]}>
                                                            <div class={["", { "rotate-90": collapseMap.value[idx] }]}>{item.children && <IconArrowRight class={["w-[18px] h-[18px]", isActiveItem(item, idx) ? "text-black-900" : "text-black-500"]} />}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </button>
                                    ) : (
                                        <a target="_blank" href={item.meta!.link as string} class="relative block px-6 sm:px-7 py-4 text-[16px] text-black-500 hover:text-black-900">
                                            <div class="flex items-center justify-between gap-3">
                                                <item.meta.icon class={["!w-[18px] !h-[18px]", isActiveItem(item, idx) ? "text-black-900" : "text-black-500"]} />
                                                <span class={["flex-1", { "opacity-0": !expandMode.value && isDesktop.value }]}>{t(`router.${item.name as string}`)}</span>
                                                <div class={["", { "opacity-0": !expandMode.value && isDesktop.value }]}>
                                                    <div class={["", { "rotate-90": collapseMap.value[idx] }]}>{item.meta!.link && <IconLink class={["!w-5 !h-5", isActiveItem(item, idx) ? "text-black-900" : "text-black-500"]} />}</div>
                                                </div>
                                            </div>
                                        </a>
                                    )}

                                    <Vue3SlideUpDown v-model={collapseMap.value[idx]} duration={300}>
                                        <div class="flex flex-col">
                                            {item.children &&
                                                item.children.map((child: any, childIdx: number) => (
                                                    <RouterLink
                                                        key={childIdx}
                                                        to={{ name: child.name, params: { level2Slug: t(`router.${child.name}`) } }}
                                                        class="pl-[58px] pr-4 py-2 text-[15px] text-black-500 hover:text-black-900 duration-300 transition-all"
                                                        activeClass="text-black-900 font-medium"
                                                        exactActiveClass="text-black-900 font-medium"
                                                    >
                                                        {t(`router.${child.name as string}`)}
                                                    </RouterLink>
                                                ))}
                                        </div>
                                    </Vue3SlideUpDown>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        {/* 手機版登出按鈕 */}
                        <div class="flex items-center justify-center gap-3 xl:hidden">
                            <el-form class="flex gap-2 w-[80px] header-form gray">
                                <el-form-item>
                                    <el-select class="!w-[80px]" v-model={currentLang.value} onChange={(val: string) => changeLanguage(val)}>
                                        {Object.values(langsOptions.value).map((langValue) => (
                                            <el-option class="text-center" key={langValue.code} label={langValue.name} value={langValue.code}>
                                                {langValue.name}
                                            </el-option>
                                        ))}
                                    </el-select>
                                </el-form-item>
                            </el-form>
                            <div class="relative flex w-[1px] h-[1rem] bg-black-700"></div>
                            <button onClick={() => logout()} class="flex gap-2 p-2 items-center text-black-500 text-[15px]">
                                <IconLogout class="!w-5 !h-5 text-black-500" />
                                登出
                            </button>
                        </div>
                        <ul class={["flex justify-center gap-3 px-6 py-6 xl:justify-start sm:px-7", { hidden: !expandMode.value }]}>
                            {contact.value.icons.map((icon: any, index: number) => (
                                <li key={index}>
                                    <div onClick={() => toSocialMedia(icon)} class="flex justify-center items-center !w-[35px] !h-[35px] bg-black-800 rounded-full cursor-pointer hover:bg-yellow-900 transition-all duration-300">
                                        <span class="!w-[35px] !h-[35px] text-white">
                                            <icon.iconName />
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    },
});
