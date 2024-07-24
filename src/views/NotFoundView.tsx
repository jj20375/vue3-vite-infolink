import { defineComponent } from "vue";
import { Icon } from "@iconify/vue";

export default defineComponent({
    props: {},
    emits: [],
    setup(props: any, { emit }) {
        return () => (
            <section class="h-full container flex justify-center items-center">
                <div class="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
                    <Icon class="text-[100px]" icon="mdi-light:home" />
                    <img class="w-[100px] mx-auto" src="img/other/404.svg" />
                    <div>
                        <div class="font-medium text-yellow-900 text-center md:text-start text-[28px] mb-2">
                            頁面不存在
                        </div>
                        <div class="text-center md:text-start text-[15px]">
                            很抱歉，您所訪問之頁面不存在，可能網址錯誤或失效。
                        </div>
                    </div>
                </div>
            </section>
        );
    },
});
