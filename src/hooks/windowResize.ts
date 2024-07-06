import { ref, onMounted, onUnmounted } from "vue";
export function useWindowResize() {
    const nowWindowSize = ref({
        width: 0,
        height: 0,
    });
    const isMobile = ref(false);
    const isPad = ref(false);
    const isLargePad = ref(false);
    const isDesktop = ref(false);
    const isLargeDesktop = ref(false);

    // 監控目前視窗大小
    // isMobile(<576px) isLargePad(<769px) isLargePad(<1280px) isDesktop(>=1280px) isLargeDesktop(>1600px)
    function handleResize() {
        nowWindowSize.value.width = window.innerWidth;
        nowWindowSize.value.height = window.innerHeight;
        if (nowWindowSize.value.width < 576) {
            isMobile.value = true;
            isPad.value = true;
            isLargePad.value = true;
            isDesktop.value = false;
            isLargeDesktop.value = false;
        } else if (nowWindowSize.value.width >= 576 && nowWindowSize.value.width < 769) {
            isMobile.value = false;
            isPad.value = true;
            isLargePad.value = true;
            isDesktop.value = false;
            isLargeDesktop.value = false;
        } else if (nowWindowSize.value.width >= 769 && nowWindowSize.value.width < 1280) {
            isMobile.value = false;
            isPad.value = false;
            isLargePad.value = true;
            isDesktop.value = false;
            isLargeDesktop.value = false;
        } else if (nowWindowSize.value.width >= 1280 && nowWindowSize.value.width < 1600) {
            isMobile.value = false;
            isPad.value = false;
            isLargePad.value = false;
            isDesktop.value = true;
            isLargeDesktop.value = false;
        } else {
            isMobile.value = false;
            isPad.value = false;
            isLargePad.value = false;
            isDesktop.value = true;
            isLargeDesktop.value = true;
        }
    }

    onMounted(() => {
        window.addEventListener("resize", handleResize);

        handleResize();
    });
    onUnmounted(() => {
        window.removeEventListener("resize", handleResize);
    });
    return {
        isMobile,
        isPad,
        isLargePad,
        isDesktop,
        isLargeDesktop,
        nowWindowSize,
    };
}
