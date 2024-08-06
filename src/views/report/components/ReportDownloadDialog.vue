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
                    :startCount="true"
                    @resendVerification="
                        resendVerification({ report_id: downloadData.id! })
                    "
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
import { ref, type PropType } from "vue";
import VerificationButton from "@/components/VerificationButton.vue";
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";
import { Vue3Lottie } from "vue3-lottie";
import { useI18n } from "vue-i18n";
import type {
    GetReportDownloadEmailValidateCodeAPIInterface,
    ReportDownloadVerifyEmailValidateCodeAPIInterface,
} from "../interface/reportDownloadInterface";
import {
    GetReportDownloadEmailValidateCodeAPI,
    ReportDownloadVerifyEmailValidateCodeAPI,
} from "@/api/reportAPI";
import { ElMessage } from "element-plus";
import { faL } from "@fortawesome/free-solid-svg-icons";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { t } = useI18n();

const props = defineProps({
    downloadData: {
        type: Object as PropType<{ fileType?: string; id?: number }>,
        default() {
            return {};
        },
    },
});

const viewPage = ref(1); // 目前顯示的頁數
const showDialog = ref(false);
const verificationButtonRef = ref<any>(null);

/**
 * 取得報表下載驗證碼
 * @param data
 */
async function getReportDownloadGetEmailValidateCode(
    form: GetReportDownloadEmailValidateCodeAPIInterface
) {
    try {
        const { data } = await GetReportDownloadEmailValidateCodeAPI(form);
        return { apiErr: false, data };
    } catch (err: any) {
        if (err.response) {
            ElMessage({
                type: "error",
                message: err.response.data.message,
            });
        }
        return { apiErr: true, err };
    }
}

/**
 * 驗證報表下載驗證碼
 */
async function reportDownloadVerifyEmailValidateCode(
    form: ReportDownloadVerifyEmailValidateCodeAPIInterface
) {
    try {
        const { data } = await ReportDownloadVerifyEmailValidateCodeAPI(form);
        return { apiErr: false, data };
    } catch (err: any) {
        if (err.response) {
            ElMessage({
                type: "error",
                message: err.response.data.message,
            });
        }
        return { apiErr: true, err };
    }
}

async function openDialog() {
    const { apiErr }: any = await getReportDownloadGetEmailValidateCode({
        report_id: props.downloadData.id!,
    });
    if (!apiErr) {
        showDialog.value = true;
    }
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
    verificationCode: "",
});

async function onSubmit() {
    if (!formRefDom.value) {
        return;
    }
    try {
        await formRefDom.value.validate();
        const sendData = {
            report_id: props.downloadData.id!,
            file_type: props.downloadData.fileType!,
            verification_code: form.value.verificationCode,
        };
        const { apiErr, data } = await reportDownloadVerifyEmailValidateCode(
            sendData
        );
        if (!apiErr) {
            viewPage.value = 2;
            window.open(data.data.url, "_blank");
        }
    } catch (err) {}
}

// 重新發送驗證碼
async function resendVerification(
    form: GetReportDownloadEmailValidateCodeAPIInterface
) {
    alert("work2");
    await getReportDownloadGetEmailValidateCode(form);
}

defineExpose({
    openDialog,
});
</script>
