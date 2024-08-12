import { defineComponent, ref } from "vue";
import VerificationButton from "@/components/VerificationButton.vue";
import type { FormInstance } from "element-plus";
import type {
    AuthLoginEmailVerfiyCodeAPIInterface,
    AuthResendLoginEmailVerifyCodeAPIInterface,
} from "../interface/authInterface";
import {
    AuthLoginEmailVerfiyCodeAPI,
    AuthResendLoginEmailVerifyCodeAPI,
} from "@/api/oauthAPI";
import { useUserStore } from "@/stores/userStore";
import { setStorage } from "@/services/localStorage";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

export default defineComponent({
    name: "AuthEmailVerify",
    props: {
        email: {
            type: String,
            default: "",
        },
    },
    emits: [],
    setup(props, { emit, expose }) {
        const router = useRouter();
        const { t } = useI18n();
        const userStore = useUserStore();
        const showDialog = ref(false);
        const loading = ref(false);
        // 倒數計時器組件 dom
        const verificationButtonRef = ref<any>(null);

        function openDialog() {
            showDialog.value = true;
            verificationButtonRef.value?.restartTimer();
        }

        function closeDialog() {
            showDialog.value = false;
            verificationButtonRef.value.resetTimer();
            setTimeout(() => {
                formRefDom.value?.resetFields();
            }, 1000);
        }

        const form = ref<{ email: string; verificationCode: string }>({
            email: "",
            verificationCode: "",
        });

        // 表單dom
        const formRefDom = ref<FormInstance | null>(null);

        const rules = ref({
            verificationCode: [
                {
                    required: true,
                    message: t("auth-verify.code.warning"),
                    trigger: ["change", "blur"],
                },
            ],
        });

        async function onSubmit() {
            if (!formRefDom.value) {
                return;
            }
            try {
                await formRefDom.value.validate();
                const sendData: AuthLoginEmailVerfiyCodeAPIInterface = {
                    email: props.email,
                    verification_code: form.value.verificationCode,
                };
                await authLoginEmailVerifyCode(sendData);
            } catch (err) {}
        }

        /**
         * 驗證登入信箱身份驗證碼
         * @param form
         */
        async function authLoginEmailVerifyCode(
            form: AuthLoginEmailVerfiyCodeAPIInterface
        ) {
            loading.value = true;
            try {
                const { data } = await AuthLoginEmailVerfiyCodeAPI(form);
                setStorage("token", data.data.access_token);
                setTimeout(async () => {
                    await userStore.getUserPorfile();
                    closeDialog();
                    loading.value = false;
                    return router.push({
                        name: "home",
                        params: { slug: t("router.home") },
                    });
                }, 1000);
            } catch (err: any) {
                console.log("AuthLoginEmailVerfiyCodeAPI err =>", err);
                loading.value = false;
                if (err.response) {
                    ElMessage({
                        type: "error",
                        message: err.response.data.message,
                    });
                }
            }
        }

        /**
         * 重發登入信箱驗證碼
         * @param form
         */
        async function authResendLoginEmailVerifyCode(
            form: AuthResendLoginEmailVerifyCodeAPIInterface
        ) {
            try {
                const { data } = await AuthResendLoginEmailVerifyCodeAPI(form);
            } catch (err) {
                console.log("AuthResendLoginEmailVerifyCodeAPI err =>", err);
            }
        }

        expose({
            openDialog,
        });

        return () => (
            <el-dialog
                class="custom-dialog"
                close-on-click-modal
                lock-scroll
                show-close={false}
                width={500}
                center
                align-center
                append-to-body
                v-model={showDialog.value}
                before-close={closeDialog}
            >
                <div>
                    <h2 class="text-black-800 text-center font-semibold text-[24px] mt-4 mb-4">
                        {t("auth-verify.title")}
                    </h2>
                    <p class="text-black-800 text-center text-[15px]">
                        {t("auth-verify.description", { email: props.email })}
                    </p>
                    <el-form
                        class="flex gap-2 mt-8 login-form"
                        ref={formRefDom}
                        model={form.value}
                        rules={rules.value}
                    >
                        <el-form-item prop="verificationCode" class="flex-1">
                            <el-input
                                v-model={form.value.verificationCode}
                                placeholder={t("auth-verify.code.placeholder")}
                            />
                        </el-form-item>
                        <VerificationButton
                            startCount={true}
                            onResendVerification={() =>
                                authResendLoginEmailVerifyCode({
                                    email: props.email,
                                })
                            }
                            ref={verificationButtonRef}
                        />
                    </el-form>
                    <div class="mt-4 text-center">{t("auth-verify.tip")}</div>
                    <div class="flex flex-col gap-4 mt-6 md:flex-row">
                        <button
                            class="order-2 w-full border-btn md:order-1"
                            onClick={closeDialog}
                        >
                            {t("global.back")}
                        </button>
                        <button
                            v-loading={loading.value}
                            class="order-1 w-full yellow-btn md:order-2"
                            onClick={onSubmit}
                        >
                            {t("global.confirm")}
                        </button>
                    </div>
                </div>
            </el-dialog>
        );
    },
});
