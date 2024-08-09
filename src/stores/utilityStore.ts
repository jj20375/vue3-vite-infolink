import { ref } from "vue";
import { defineStore } from "pinia";

export const useUtilityStore = defineStore("utilityStore", () => {
    const openMenu = ref(false);

    /**
     * 設定開關 menu
     */
    function setOpenMenu(value: boolean) {
        openMenu.value = value;
        if(openMenu.value){
            document.body.style.overflow = "hidden";
        }else{
            document.body.style.overflow = "";
        }
    }

    return {
        openMenu,
        setOpenMenu,
    };
});
