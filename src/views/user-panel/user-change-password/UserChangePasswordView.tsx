import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { validatePassword } from "@/services/formValidator";
import type { FormInstance } from "element-plus";
import type { ColumnsInterface } from "@/interface/global.d";
import { useWindowResize } from "@/hooks/windowResize";
import Breadcrumb from "@/components/Breadcrumb";
import { useI18n } from "vue-i18n";
import { UserChangePasswordAPI } from "@/api/userAPI";
import { ElMessage } from "element-plus";
import { AuthLogoutAPI } from "@/api/oauthAPI";
import { useUserStore } from "@/stores/userStore";

export default defineComponent({
    name: "UserResetPassword",
    props: {},
    emits: [],
    setup(props, { emit }) {
        const { t } = useI18n();
        const router = useRouter();
        const userStore = useUserStore();
        const loading = ref(false);
        // 重置密碼表單欄位 key
        type UserResetPasswordFormPropType =
            | "oldPassword"
            | "newPassword"
            | "newPasswordConfirmation";

        interface ResetPasswordForm {
            oldPassword: string;
            newPassword: string;
            newPasswordConfirmation: string;
        }

        const { isMobile } = useWindowResize();

        const formRefDom = ref<FormInstance | null>(null);

        const form = ref<ResetPasswordForm>({
            oldPassword: "",
            newPassword: "",
            newPasswordConfirmation: "",
        });

        const formColumns = computed<
            ColumnsInterface<UserResetPasswordFormPropType>[]
        >(() => [
            {
                prop: "oldPassword",
                label: t("user-reset-password.old-password.label"),
                placeholder: t("user-reset-password.old-password.placeholder"),
                style: "input",
                showPassword: true,
            },
            {
                prop: "newPassword",
                label: t("user-reset-password.new-password.label"),
                placeholder: t("user-reset-password.new-password.placeholder"),
                style: "input",
                showPassword: true,
            },
            {
                prop: "newPasswordConfirmation",
                label: t("user-reset-password.confirm-password.label"),
                placeholder: t(
                    "user-reset-password.confirm-password.placeholder"
                ),
                style: "input",
                showPassword: true,
            },
        ]);

        const rules = computed<any>(() => {
            return {
                oldPassword: [
                    {
                        required: true,
                        message: t("user-reset-password.old-password.warning"),
                        trigger: ["change", "blur"],
                    },
                    {
                        required: true,
                        validator: validatePassword,
                        trigger: ["change", "blur"],
                        message: t("user-reset-password.new-password.invalid"),
                    },
                ],
                newPassword: [
                    {
                        required: true,
                        message: t("user-reset-password.new-password.warning"),
                        trigger: ["change", "blur"],
                    },
                    {
                        required: true,
                        validator: validatePassword,
                        trigger: ["change", "blur"],
                        message: t("user-reset-password.new-password.invalid"),
                    },
                ],
                newPasswordConfirmation: [
                    {
                        required: true,
                        message: t(
                            "user-reset-password.confirm-password.warning"
                        ),
                        trigger: ["change", "blur"],
                    },
                    {
                        required: true,
                        message: t(
                            "user-reset-password.confirm-password.invalid"
                        ),
                        validator: (
                            rule: any,
                            value: string,
                            callback: (error?: string | Error) => void
                        ) => {
                            if (value !== form.value.newPassword) {
                                callback(new Error());
                            } else {
                                callback();
                            }
                        },
                        trigger: ["change", "blur"],
                    },
                ],
            };
        });

        async function onSubmit(e: Event) {
            e.preventDefault();
            try {
                if (formRefDom.value) {
                    await formRefDom.value.validate();
                    await changePassword(form.value);
                }
            } catch (err) {
                return;
            }
        }

        async function changePassword(data: ResetPasswordForm) {
            const sendData = {
                old_password: data.oldPassword,
                new_password: data.newPassword,
                new_password_confirmation: data.newPasswordConfirmation,
            };
            loading.value = true;
            try {
                await UserChangePasswordAPI(sendData);
                await logout();
                ElMessage({
                    type: "success",
                    message: t("global.success.change"),
                });
            } catch (err) {
            } finally {
                loading.value = false;
            }
            return;
        }

        /**
         * 登出
         */
        async function logout() {
            userStore.removeUser();
            router.push({
                name: "login",
                params: { slug: t("router.login") },
            });
        }

        return () => (
            <section>
                <div class="relative py-[20px] xl:py-[30px] px-[20px] xl:px-[30px]">
                    <div class="xl:max-w-[1300px] mx-auto">
                        <Breadcrumb />
                        <h3 class="text-[28px] font-semibold mb-5 sm:mb-7">
                            {t("router.user-change-password")}
                        </h3>
                        <div class="xl:max-w-[1200px] bg-white p-5 mt-5 border-gray-600 border rounded-[4px]">
                            <el-form
                                class="custom-form"
                                ref={formRefDom}
                                model={form.value}
                                rules={rules.value}
                                require-asterisk-position="right"
                            >
                                <div class="w-full md:w-1/2 xl:w-1/3 flex flex-col gap-6">
                                    {formColumns.value.map((item) => (
                                        <el-form-item
                                            prop={item.prop}
                                            label={item.label}
                                        >
                                            {item.style === "input" && (
                                                <el-input
                                                    type={
                                                        item.type
                                                            ? item.type
                                                            : "text"
                                                    }
                                                    show-password={
                                                        item.showPassword
                                                    }
                                                    disabled={item.disabled}
                                                    placeholder={
                                                        item.placeholder
                                                    }
                                                    v-model={
                                                        form.value[item.prop]
                                                    }
                                                ></el-input>
                                            )}
                                        </el-form-item>
                                    ))}
                                </div>
                                <button
                                    v-loading={loading.value}
                                    onClick={onSubmit}
                                    class={[
                                        "yellow-btn mt-6",
                                        isMobile.value ? "w-full" : "btn-sm",
                                    ]}
                                >
                                    {t("reset-password.submit")}
                                </button>
                            </el-form>
                        </div>
                    </div>
                </div>
            </section>
        );
    },
});
