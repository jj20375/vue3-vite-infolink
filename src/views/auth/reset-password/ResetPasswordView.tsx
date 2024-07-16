import { defineComponent, ref } from "vue";
import { validatePassword } from "@/services/formValidator";
import type { ColumnsInterface } from "@/interface/global.d";
import type { FormInstance } from "element-plus";
import { useI18n } from "vue-i18n";

export default defineComponent({
    name: "ResetPasswordView",
    props: {},
    emits: [],
    setup(props, { emit }) {
        const { t } = useI18n();
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
                await resetPassword(form.value);
            } catch (err) {}
        }

        async function resetPassword(form: ResetPasswordFormInterface) {
            try {
            } catch (err) {}
        }

        return () => (
            <section>
                <div class="container">
                    <div class="w-full sm:w-fit mx-auto mb-12">
                        <h3 class="font-bold text-center text-[22px] md:text-[28px] mb-5">{t("router.reset-password")}</h3>
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
