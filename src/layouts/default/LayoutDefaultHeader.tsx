import { defineComponent, ref, computed } from "vue";
import { setStorage } from "@/services/localStorage";
// 語系選項
import langs from "@/i18n/langs";
import { useI18n } from "vue-i18n";
import { useInitStore } from "@/stores/initStore";
import { RouterLink, useRoute, useRouter } from "vue-router";
import IconLogo1 from "@/components/icons/IconLogo1.vue";

export default defineComponent({
    name: "LayoutDefaultHeader",
    setup(props, { emit }) {
        const router = useRouter();
        const route = useRoute();
        const initStore = useInitStore();
        const initData = computed(() => initStore.initData);
        const langsOptions = ref(langs);
        const { locale, t } = useI18n();
        // 預設語系
        const currentLang = ref(locale.value);
        /**
         * 更換語系
         * @param lang 語系 code
         */
        function changeLanguage(lang: string) {
            locale.value = lang;
            setStorage("lang", lang);
            document.title = t(`router.${route.name as string}`);
            if (route.meta.parent !== undefined) {
                router.push({
                    name: route.name,
                    params: { level2Slug: t(`router.${route.name as string}`) },
                });
                return;
            }
            router.push({
                name: route.name,
                params: { slug: t(`router.${route.name as string}`) },
            });
        }
        return () => (
            <header class="relative z-[500] w-full">
                <nav class="mx-[24px] xl:mx-[60px] flex justify-between items-center h-headerMb md:h-header">
                    <div class="">
                        <RouterLink
                            class="block mx-auto"
                            to={{ name: "index" }}
                        >
                            <img
                                src={initData.value.site.site_logo}
                                class="h-[46px] w-fit transition-all duration-300"
                                alt=""
                            />
                            {/* <IconLogo1 class="h-[46px] w-fit transition-all duration-300" /> */}
                        </RouterLink>
                    </div>
                    <div>
                        <el-form class="flex gap-2 w-[80px] header-form">
                            <el-form-item>
                                <el-select
                                    class="!w-[80px]"
                                    v-model={currentLang.value}
                                    onChange={() =>
                                        changeLanguage(currentLang.value)
                                    }
                                >
                                    {Object.values(langsOptions.value).map(
                                        (langValue) => {
                                            return (
                                                <el-option
                                                    class="text-center"
                                                    key={langValue.code}
                                                    value={langValue["code"]}
                                                    label={langValue["name"]}
                                                ></el-option>
                                            );
                                        }
                                    )}
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                </nav>
            </header>
        );
    },
});
