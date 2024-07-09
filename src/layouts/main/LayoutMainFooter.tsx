import { defineComponent, computed } from "vue";
import { useInitStore } from "../../stores/initStore";
export default defineComponent({
    setup(props, { emit }) {
        const initStore = useInitStore();
        const initData = computed(() => initStore.initData);
        return () => <footer class="relative w-full text-[13px] px-7 py-4 border-t border-black-100 text-black-600 bg-gray-100">{initData.value.site.site_name} ©2024 All Rights Reserved.</footer>;
    },
});
