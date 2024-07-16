import { defineComponent, ref } from "vue";
import { validatePassword } from "@/services/formValidator";
import type { ColumnsInterface } from "@/interface/global.d";
import type { FormInstance } from "element-plus";
import { AuthResetInitPasswordAPI } from "@/api/oauthAPI";
import type { AuthResetPasswordInterface } from "../interface/authInterface";

export default defineComponent({
    name: "ResetPasswordView",
    props: {},
    emits: [],
    setup(props, { emit }) {
        type ResetPasswordFormPropType = "newPassword" | "newPasswordConfirmation";

        interface ResetPasswordFormInterface {
            oldPassword: string;
            newPassword: string;
            newPasswordConfirmation: string;
        }

        const formColumns = ref<ColumnsInterface<ResetPasswordFormPropType>[]>([
            {
                prop: "newPassword",
                label: "請輸入新密碼",
                placeholder: "密碼，8碼以上英數混合且1碼需大寫",
                style: "input",
                showPassword: true,
            },
            {
                prop: "newPasswordConfirmation",
                label: "確認新密碼",
                placeholder: "請再次輸入密碼",
                style: "input",
                showPassword: true,
            },
        ]);

        const formRefDom = ref<FormInstance | null>(null);

        const form = ref<ResetPasswordFormInterface>({
            oldPassword: "",
            newPassword: "",
            newPasswordConfirmation: "",
        });

        const rules = ref<any>({
            newPassword: [
                {
                    required: true,
                    message: "請輸入新密碼",
                    trigger: ["change", "blur"],
                },
                {
                    required: true,
                    validator: validatePassword,
                    trigger: ["change", "blur"],
                    message: "必須包含至少一個大寫字母、一個小寫字母和一個數字，並且長度至少為 8 個字元。",
                },
            ],
            newPasswordConfirmation: [
                {
                    required: true,
                    message: "請輸入確認密碼",
                    trigger: ["change", "blur"],
                },
                {
                    required: true,
                    message: "密碼不一致",
                    validator: (rule: any, value: string, callback: (error?: string | Error) => void) => {
                        if (value !== form.value.newPassword) {
                            callback(new Error());
                        } else {
                            callback();
                        }
                    },
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
                const sendData: AuthResetPasswordInterface = {
                    password: form.value.newPassword,
                    password_confirmation: form.value.newPasswordConfirmation,
                };
                await authResetInitPassword(sendData);
            } catch (err) {}
        }

        /**
         * 重設初始話密碼
         * @param form
         */
        async function authResetInitPassword(form: AuthResetPasswordInterface) {
            try {
                const { data } = await AuthResetInitPasswordAPI(form);
                console.log("AuthResetInitPasswordAPI data =>", data);
            } catch (err) {
                console.log("AuthResetInitPasswordAPI err =>", err);
            }
        }

        return () => (
            <section>
                <div class="container">
                    <div class="w-full sm:w-fit mx-auto mb-12">
                        <h3 class="font-bold text-center text-[22px] md:text-[28px] mb-5">重設密碼</h3>
                        <p class="mb-7 text-center text-[15px]">請填入新的密碼，完成後須以新密碼登入系統</p>
                        <el-form ref={formRefDom} class="login-form sm:w-[400px]" model={form.value} rules={rules.value} require-asterisk-position="right">
                            <div class="grid gap-5">
                                {formColumns.value.map((item) => {
                                    return (
                                        item.style === "input" && (
                                            <el-form-item key={item.prop} prop={item.prop} label={item.label}>
                                                <el-input show-password={item.showPassword} placeholder={item.placeholder} v-model={form.value[item.prop]}></el-input>
                                            </el-form-item>
                                        )
                                    );
                                })}
                                <div class="flex flex-col gap-4 justify-center mt-4">
                                    <button onClick={() => onSubmit()} class="yellow-btn w-full">
                                        送出
                                    </button>
                                </div>
                            </div>
                        </el-form>
                    </div>
                </div>
            </section>
        );
    },
});
