import { useRouter, onBeforeRouteUpdate, RouterLink } from "vue-router";
import { usePermissionStore } from "@/stores/permissionStore";
import { computed, onMounted, ref, markRaw } from "vue";
import { validateEmail } from "@/services/formValidator";
import IconMember from "@/components/icons/IconMember.vue";
import IconPassword from "@/components/icons/IconPassword.vue";
import type { ColumnsInterface } from "@/interface/global.d";
import type { FormInstance } from "element-plus";
import { setStorage, getStorage } from "@/services/localStorage";
import { useI18n } from "vue-i18n";
import { AuthUserLoginAPI } from "@/api/oauthAPI";
import AuthEmailVerify from "./components/AuthEmailVerify";

export default {
    name: "LoginView",
    props: {},
    emits: [],
    setup(props: any, { emit }: { emit: string }) {
        interface LoginForm {
            email: string;
            password: string;
            saveInfo: boolean;
        }
        type LoginFormPropType = "email" | "password";

        const { t } = useI18n();

        // 登入身份驗證彈窗
        const authEmailVerifyRefDom = ref<typeof AuthEmailVerify>();

        const permissionStore = usePermissionStore();

        const formRefDom = ref<FormInstance | null>(null);

        const form = ref<LoginForm>({
            email: "admin@admin.cc",
            password: "Aa168168",
            saveInfo: false,
        });

        const formColumns = ref<ColumnsInterface<LoginFormPropType>[]>([
            {
                iconName: markRaw(IconMember),
                prop: "email",
                placeholder: "會員帳號 (Email)",
                style: "input",
            },
            {
                iconName: markRaw(IconPassword),
                prop: "password",
                placeholder: "密碼，8碼以上英數混合且1碼大寫",
                style: "input",
                type: "password",
                showPassword: true,
            },
        ]);

        const rules = ref<any>({
            email: [
                {
                    required: true,
                    message: "請輸入信箱",
                    trigger: "blur",
                },
                {
                    required: true,
                    validator: validateEmail,
                    trigger: ["change", "blur"],
                    message: "格式不正確",
                },
            ],
            password: [
                {
                    required: true,
                    message: "請輸入密碼",
                    trigger: "blur",
                },
            ],
        });
        async function getPermissionRouter() {
            await permissionStore.getPermissionRouter();
        }

        async function login(form: LoginForm) {
            try {
                if (form.saveInfo) {
                    setStorage("saveInfo", true);
                    setStorage("loginEmail", form.email);
                }
                const { data } = await AuthUserLoginAPI(form);
                console.log("AuthUserLoginAPI data =>", data);
            } catch (err) {
                console.log("AuthUserLoginAPI err =>", err);
            }
        }

        async function onSubmit(event: Event) {
            console.log("event =->", event);
            event.preventDefault();
            if (!formRefDom.value) {
                return;
            }
            try {
                await formRefDom.value.validate();
                console.log("authEmailVerifyRefDom.value =>", authEmailVerifyRefDom.value);
                await login(form.value);
                authEmailVerifyRefDom.value!.openDialog();
                // await getPermissionRouter();
            } catch (err) {}
        }

        onMounted(async () => {
            if (getStorage("saveInfo") && getStorage("loginEmail")) {
                form.value.email = getStorage("loginEmail");
                form.value.saveInfo = true;
            }
        });

        onBeforeRouteUpdate(async (to, from, next) => {
            next();
        });

        return () => (
            <>
                <section>
                    <div class="container">
                        <div class="w-full sm:w-[400px] mx-auto mb-12">
                            <h3 class="font-bold text-[22px] sm:text-[28px] text-center mb-6">報告下載專區</h3>
                            <div class="w-[40px] h-[6px] bg-yellow-900 mx-auto mb-6 sm:mb-8"></div>
                            <el-form class="login-form" ref={formRefDom} model={form.value} rules={rules.value} require-asterisk-position="right">
                                <div class="grid gap-5">
                                    {formColumns.value.map((item) => (
                                        <el-form-item key={item.prop} prop={item.prop}>
                                            <el-input type={item.type} show-password={item.showPassword} placeholder={item.placeholder} v-model={form.value[item.prop]}>
                                                {{
                                                    prefix: () => <item.iconName class="!w-[20px] !h-[20px] !ml-2 !mr-3 text-black-800" />,
                                                }}
                                            </el-input>
                                        </el-form-item>
                                    ))}

                                    <div class="flex justify-between mt-1">
                                        <el-form-item class="!mb-0" prop="saveInfo">
                                            <el-checkbox class="!h-fit text-[15px] " v-model={form.value.saveInfo} label="記住我" size="large" />
                                        </el-form-item>
                                        <RouterLink to={{ name: "forgot-password", params: { slug: t("router.forgot-password") } }}>
                                            <div class="text-[15px]">忘記密碼?</div>
                                        </RouterLink>
                                    </div>
                                    <button class="yellow-btn mt-4 !w-full" onClick={onSubmit}>
                                        登入
                                    </button>
                                </div>
                            </el-form>
                        </div>
                    </div>
                </section>
                <AuthEmailVerify ref={authEmailVerifyRefDom} email={form.value.email} />
            </>
        );
    },
};
