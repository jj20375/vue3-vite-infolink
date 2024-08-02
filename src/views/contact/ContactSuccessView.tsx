import { defineComponent } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, RouterLink } from "vue-router";
export default defineComponent({
    props: {},
    emits: [],
    setup(props, { emit }) {
        const { t } = useI18n();
        const link = {
            name: "home",
            params: { slug: t("router.home") },
        };
        return () => (
            <section class="mt-headerMb xl:mt-header py-[70px] ">
                <div class="container flex justify-center">
                    <div class="max-w-[500px]">
                        <div class="font-bold text-[28px] md:text-left text-center mt-5 mb-5">
                            {t("contact-success.title")}
                        </div>
                        <div class="md:text-left text-center">
                            {t("contact-success.content")}
                        </div>
                        <div class="flex justify-center mt-10">
                            <RouterLink to={link}>
                                <button class="yellow-btn">
                                    {t("global.back-home")}
                                </button>
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </section>
        );
    },
});
