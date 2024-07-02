import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", () => {
    // 使用者資料
    const user = ref({});
    // 判斷是否有登入
    const isAuth = ref(false);

    /**
     * 設定使用者資料
     */
    function setUser(userData: any) {
        return (user.value = userData);
    }

    /**
     * 設定是否登入
     */
    function setIsAuth(isAuthData: boolean) {
        return (isAuth.value = isAuthData);
    }
    /**
     * 清除使用者資料
     */
    function clearUser() {
        return (user.value = {});
    }
    /**
     * 清除是否登入
     */
    function clearIsAuth() {
        return (isAuth.value = false);
    }
    /**
     * 取得使用者資料
     */
    function getUserPorfile() {
        return user.value;
    }
    /**
     * 移除登入資料與狀態
     */
    function removeUser() {
        clearUser();
        clearIsAuth();
    }

    return { user, isAuth, setUser, setIsAuth };
});
