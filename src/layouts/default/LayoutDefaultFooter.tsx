import { defineComponent, computed } from "vue";
import { useInitStore } from "@/stores/initStore";
export default defineComponent({
    name: "LayoutDefaultFooter",
    setup(prosp, { emit }) {
        const initStore = useInitStore();
        const initData = computed(() => initStore.initData);
        const copyright = {
            text: `${initData.value.site.site_name} ©2024 Copyright All Rights Reserved.`,
        };

        return () => (
            <div class="flex justify-center my-[30px] px-6">
                <div class="text-[13px] text-black-400 text-center">{copyright.text}</div>
            </div>
        );
    },
});
