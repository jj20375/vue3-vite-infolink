import { ref } from "vue";
import { defineStore } from "pinia";

export const useUtilityStore = defineStore("utilityStore", () => {
    const openMenu = ref(false);

    /**
     * 設定開關 menu
     */
    function setOpenMenu(value: boolean) {
        openMenu.value = value;
    }

    return {
        openMenu,
        setOpenMenu,
    };
});
