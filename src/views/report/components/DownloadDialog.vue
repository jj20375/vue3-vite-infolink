<template>
    <el-dialog
        class="custom-dialog"
        close-on-click-modal
        lock-scroll
        :show-close="false"
        :width="500"
        center
        align-center
        append-to-body
        v-model="showDialog"
        :before-close="closeDialog"
    >
        <template v-if="viewPage === 1">
            <h2
                class="text-black-800 text-center font-semibold text-[24px] mt-4 mb-4"
            >
                {{ t("auth-verify.title") }}
            </h2>
            <p class="text-black-800 text-center text-[15px]">
                {{ t("auth-verify.description", { email: user.email }) }}
            </p>
            <el-form
                class="flex gap-2 mt-8 login-form"
                ref="formRefDom"
                :model="form"
                :rules="rules"
            >
                <el-form-item prop="verificationCode" class="flex-1">
                    <el-input
                        v-model="form.verificationCode"
                        :placeholder="t('auth-verify.code.placeholder')"
                    />
                </el-form-item>
                <VerificationButton
                    :restarter="true"
                    @resendVerification="resendVerification"
                    ref="verificationButtonRef"
                />
            </el-form>
            <div class="mt-4 text-center">{{ t("auth-verify.tip") }}</div>
            <div class="flex flex-col gap-4 mt-6 md:flex-row">
                <button
                    class="order-2 w-full border-btn md:order-1"
                    @click="closeDialog"
                >
                    {{ t("global.back") }}
                </button>
                <button
                    class="order-1 w-full yellow-btn md:order-2"
                    @click="onSubmit"
                >
                    {{ t("global.confirm") }}
                </button>
            </div>
        </template>
        <template v-else-if="viewPage === 2">
            <Vue3Lottie
                animationLink="/json/check.json"
                :height="100"
                :width="100"
            />
            <h2
                class="text-black-800 text-center font-semibold text-[24px] mt-4 mb-4"
            >
                {{ t("auth-verify.success") }}
            </h2>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import VerificationButton from "@/components/VerificationButton.vue";
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";
import { Vue3Lottie } from "vue3-lottie";
import { useI18n } from "vue-i18n";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { t } = useI18n();

const props = defineProps({
    downloadData: {
        type: Object,
        default() {
            return {};
        },
    },
});

const viewPage = ref(1); // 目前顯示的頁數
const showDialog = ref(false);
const verificationButtonRef = ref<any>(null);

function openDialog() {
    showDialog.value = true;
    verificationButtonRef.value?.restartTimer();
}

function closeDialog() {
    showDialog.value = false;
    verificationButtonRef.value.resetTimer();
    setTimeout(() => {
        viewPage.value = 1;
        formRefDom.value?.resetFields();
    }, 1000);
}

// 表單
const formRefDom = ref<any>();

const rules = ref({
    verificationCode: [
        {
            required: true,
            message: t("auth-verify.code.warning"),
            trigger: ["change", "blur"],
        },
    ],
});

const form = ref<any>({
    id: "",
    fileType: "",
    verificationCode: "",
});

const onSubmit = async () => {
    formRefDom.value.validate(async (valid: any) => {
        if (!valid) {
            return;
        }
        const payload = {
            id: props.downloadData.id,
            fileType: props.downloadData.fileType,
            verification_code: form.value.verificationCode,
        };
        console.log(payload);
        viewPage.value = 2;
    });
};

// 重新發送驗證碼
const resendVerification = async () => {
    console.log("resendVerification");
    const params = {
        scene: "register",
        email: history.state.email ?? user.value.email,
    };
    // await $api().EmailVerificationResendAPI(params);
};

defineExpose({
    openDialog,
});
</script>
