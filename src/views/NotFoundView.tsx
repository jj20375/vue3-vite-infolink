import { defineComponent } from "vue";
import { Icon } from "@iconify/vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
    props: {},
    emits: [],
    setup(props: any, { emit }) {
        const { t } = useI18n();
        return () => (
            <section class="h-full container flex justify-center items-center">
                <div class="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
                    <img class="w-[100px] mx-auto" src="img/other/404.svg" />
                    <div>
                        <div class="font-medium text-yellow-900 text-center md:text-start text-[28px] mb-2">
                            {t("404.title")}
                        </div>
                        <div class="text-center md:text-start text-[15px]">
                            {t("404.description")}
                        </div>
                    </div>
                </div>
            </section>
        );
    },
});
