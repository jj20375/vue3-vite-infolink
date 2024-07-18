import { defineComponent, ref } from "vue";
import VerificationButton from "@/components/VerificationButton.vue";
import type { FormInstance } from "element-plus";
import type { AuthLoginEmailVerfiyCodeAPIInterface, AuthResendLoginEmailVerifyCodeAPIInterface } from "../interface/authInterface";
import { AuthLoginEmailVerfiyCodeAPI, AuthResendLoginEmailVerifyCodeAPI } from "@/api/oauthAPI";
import { useUserStore } from "@/stores/userStore";
import { setStorage } from "@/services/localStorage";

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
        const userStore = useUserStore();
        const showDialog = ref(false);
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
                    message: "請輸入驗證碼",
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
        async function authLoginEmailVerifyCode(form: AuthLoginEmailVerfiyCodeAPIInterface) {
            try {
                const { data } = await AuthLoginEmailVerfiyCodeAPI(form);
                setStorage("token", data.data.access_token);
                console.log("AuthLoginEmailVerfiyCodeAPI data =>", data);
                closeDialog();
                setTimeout(async () => {
                    await userStore.getUserPorfile();
                }, 1000);
            } catch (err) {
                console.log("AuthLoginEmailVerfiyCodeAPI err =>", err);
            }
        }

        /**
         * 重發登入信箱驗證碼
         * @param form
         */
        async function authResendLoginEmailVerifyCode(form: AuthResendLoginEmailVerifyCodeAPIInterface) {
            try {
                const { data } = await AuthResendLoginEmailVerifyCodeAPI(form);
                console.log("AuthResendLoginEmailVerifyCodeAPI data =>", data);
            } catch (err) {
                console.log("AuthResendLoginEmailVerifyCodeAPI err =>", err);
            }
        }

        expose({
            openDialog,
        });

        return () => (
            <el-dialog class="custom-dialog" close-on-click-modal lock-scroll show-close={false} width={500} center align-center append-to-body v-model={showDialog.value} before-close={closeDialog}>
                <div>
                    <h2 class="text-black-800 text-center font-semibold text-[24px] mt-4 mb-4">身份驗證</h2>
                    <p class="text-black-800 text-center text-[15px]">已將驗證碼碼發送到 {props.email}</p>
                    <el-form class="flex gap-2 mt-8 login-form" ref={formRefDom} model={form.value} rules={rules.value}>
                        <el-form-item prop="verificationCode" class="flex-1">
                            <el-input v-model={form.value.verificationCode} placeholder="請輸入驗證碼" />
                        </el-form-item>
                        <VerificationButton startCount={true} onResendVerification={() => authResendLoginEmailVerifyCode({ email: props.email })} ref={verificationButtonRef} />
                    </el-form>
                    <div class="mt-4 text-center">沒收到驗證信件？ 請先確認您的垃圾郵件</div>
                    <div class="flex flex-col gap-4 mt-6 md:flex-row">
                        <button class="order-2 w-full border-btn md:order-1" onClick={closeDialog}>
                            返回
                        </button>
                        <button class="order-1 w-full yellow-btn md:order-2" onClick={onSubmit}>
                            確認
                        </button>
                    </div>
                </div>
            </el-dialog>
        );
    },
});
