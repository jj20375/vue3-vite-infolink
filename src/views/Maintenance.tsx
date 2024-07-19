import { useI18n } from "vue-i18n";
export default {
    props: {},
    emits: [],
    setup(props: any, { emit }: { emit: string }) {
        const { t } = useI18n();
        return () => (
            <section class="h-full container flex justify-center items-center">
                <div class="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
                    <img class="w-[100px] mx-auto" src="img/other/maintenance.svg" />
                    <div>
                        <div class="font-medium text-yellow-900 text-center md:text-start text-[28px] mb-2">{t("maintenance.title")}</div>
                        <div class="text-center md:text-start text-[15px]">很抱歉，目前正在進行系統維護，請稍後再瀏覽本站。</div>
                    </div>
                </div>
            </section>
        );
    },
};