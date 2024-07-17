<template>
    <div class="flex items-center">
        <div class="bg-transparent w-[125px] border tracking-wide border-black-300 rounded-full transition-all duration-300 py-1 text-center text-[14px] " @click="restartTimer" :class="countdownTimer > 0 ? 'cursor-not-allowed text-black-300':'cursor-pointer text-black-800 hover:border-black-800'">
            {{ countdownTimer > 0 ?  t("download.countdown", { time: formatTime(countdownTimer)}) : t("download.resend") }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const countdownTimer = ref(180); // 設置初始倒數時間為 180 秒
let timerId: any; // 用於儲存計時器的 ID
const emit = defineEmits(["resendVerification"]);

const props = defineProps({
    // 判斷是否啟用倒數計時
    startCount: {
        type: Boolean,
        default() {
            return true;
        },
    },
    countdownTimer: {
        type: Number,
        default: 180,
    },
});

const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const startTimer = () => {
    timerId = setInterval(() => {
        // 每一秒減少倒數時間
        countdownTimer.value--;

        // 如果倒數計時結束，清除計時器並重設倒數時間為 3分鐘 = 180 秒
        if (countdownTimer.value === 0) {
            clearInterval(timerId);
            timerId = undefined;
        }
    }, 1000);
};

const restartTimer = () => {
    if (countdownTimer.value === 0) {
        emit("resendVerification");
        // 清除舊的計時器
        if (timerId !== undefined) {
            clearInterval(timerId);
            timerId = undefined;
        }

        countdownTimer.value = 180;
        // 啟動新的計時器
        startTimer();
    }
};

const resetTimer = () => {
    if (timerId !== undefined) {
        clearInterval(timerId);
        timerId = undefined;
    }
    countdownTimer.value = 0;
};

// 在組件被掛載後啟動計時器
onMounted(() => {
    if (props.startCount) {
        emit("resendVerification");
        startTimer();
    } else {
        countdownTimer.value = 0;
    }
});

// 在組件被卸載前清除計時器
onBeforeUnmount(() => {
    if (timerId !== undefined) {
        clearInterval(timerId);
        timerId = undefined;
    }
});

defineExpose({
    restartTimer,
    resetTimer,
});
</script>

<style lang="scss" scoped>
.yellow-btn {
    &.is-disabled {
        @apply bg-gray-100 text-gray-700 cursor-not-allowed;
    }
}
</style>
