import { defineComponent, ref } from "vue";
import { validateEmail } from "@/services/formValidator";
import { RouterLink } from "vue-router";
import type { FormInstance } from "element-plus";
import type { ColumnsInterface } from "@/interface/global.d";
import { useI18n } from "vue-i18n";

export default defineComponent({
    name: "ForgotPasswordView",
    props: {},
    emite: [],
    setup(props, { emit }) {
        type ForgotPasswordFormPropType = "email";

        interface ForgotPasswordFormInterface {
            email: string;
        }

        const { t } = useI18n();

        const formRefDom = ref<FormInstance | null>(null);

        const form = ref<ForgotPasswordFormInterface>({
            email: "",
        });

        const formColumns = ref<ColumnsInterface<ForgotPasswordFormPropType>[]>([
            {
                prop: "email",
                label: t("forgot-password.email.label"),
                placeholder: t("forgot-password.email.placeholder"),
                style: "input",
            },
        ]);

        const rules = ref<any>({
            email: [
                {
                    required: true,
                    message: "請輸入電子信箱",
                    trigger: ["change", "blur"],
                },
                {
                    required: true,
                    validator: validateEmail,
                    trigger: ["change", "blur"],
                    message: "格式不正確",
                },
            ],
        });

        async function onSubmit() {
            if (!formRefDom.value) {
                return;
            }
            try {
                await formRefDom.value.validate();
                await forgotPassword(form.value);
            } catch (err) {}
        }

        async function forgotPassword(form: ForgotPasswordFormInterface) {
            try {
            } catch (err) {}
        }
        return () => (
            <section>
                <div class="container">
                    <div class="w-full sm:w-fit mx-auto mb-12">
                        <h3 class="font-bold text-center text-[22px] md:text-[28px] mb-5">{t("router.forgot-password")}</h3>
                        <p class="mb-7 text-center text-[15px]">{t("forgot-password.description")}</p>
                        <el-form class="login-form sm:w-[400px] mx-auto" ref={formRefDom} model={form.value} rules={rules.value} require-asterisk-position="right">
                            <div class="grid gap-5">
                                {formColumns.value.map((item) => (
                                    <el-form-item prop={item.prop} label={item.label}>
                                        <el-input type={item.type} show-password={item.showPassword} placeholder={item.placeholder} v-model={form.value[item.prop]}></el-input>
                                    </el-form-item>
                                ))}

                                <div class="flex flex-col gap-4 justify-center mt-4">
                                    <button onClick={() => onSubmit()} class="yellow-btn full">
                                        {t("forgot-password.submit")}
                                    </button>
                                    <RouterLink to={{ name: "login", params: { slug: t(`router.login`) } }}>
                                        <button class="transparent-btn w-full">{t("forgot-password.back")}</button>
                                    </RouterLink>
                                </div>
                            </div>
                        </el-form>
                    </div>
                </div>
            </section>
        );
    },
});
