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
            <section class="">
                <div class="container flex justify-center items-center gap-4">
                    <img
                        class="w-[100px] h-[100px]"
                        src="img/other/check.gif"
                    />
                    <div>
                        <div class="font-bold text-[28px] md:text-left text-center mb-3">
                            {t("contact-success.title")}
                        </div>
                        <div class="md:text-left text-center">
                            {t("contact-success.content")}
                        </div>
                    </div>
                </div>
                <div class="flex justify-center mt-10">
                    <RouterLink to={link}>
                        <button class="yellow-btn">
                            {t("global.back-home")}
                        </button>
                    </RouterLink>
                </div>
            </section>
        );
    },
});
