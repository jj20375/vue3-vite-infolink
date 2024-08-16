import { defineComponent, ref, computed, watch, toRefs, onMounted } from "vue";
import type { PropType } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useWindowResize } from "@/hooks/windowResize";
import { ElMessage, type FormInstance } from "element-plus";
import type {
    UserPanelUserInfoResponseAPIInterface,
    UserUpdateProfileRequestAPIInterface,
} from "./interface/userInterface";
import type { ColumnsInterface } from "@/interface/global.d";
import Breadcrumb from "@/components/Breadcrumb";
import { isEmpty } from "@/services/utils";
import { useI18n } from "vue-i18n";
import { useInitStore } from "@/stores/initStore";
import { UpdateUserProfileAPI } from "@/api/userAPI";

type UserFormProp =
    | "email"
    | "name"
    | "jobTitle"
    | "phone"
    | "messagingApp"
    | "messagingAppCustomName"
    | "messagingAppId";

type FormColumnsInterface = ColumnsInterface<UserFormProp>;

// 預設使用者資料表單
const defaultUserForm: UserPanelUserInfoResponseAPIInterface = {
    email: "",
    name: "",
    jobTitle: "",
    phone: "",
    messagingApp: "",
    messagingAppId: "",
    needSettingProfile: false,
    needSettingPassword: false,
};

/**
 * 使用者表單組件
 */
const UserForm = defineComponent({
    name: "UserForm",
    props: {
        formRefDom: {
            type: Object as PropType<FormInstance | null>,
            default: null,
        },
        form: {
            type: Object as PropType<UserPanelUserInfoResponseAPIInterface>,
            default() {
                return defaultUserForm;
            },
        },
        formColumns: {
            type: Array as PropType<FormColumnsInterface[]>,
        },
        formRules: {
            type: Object as PropType<any>,
        },
        userInfo: {
            type: Array as PropType<FormColumnsInterface[]>,
        },
    },
    emits: ["update:userInfo", "update:form", "update:formRules"],
    setup(props, { emit }) {
        const { t } = useI18n();
        const form = ref(props.form);
        const userInfo = ref(props.userInfo);
        const formRulesData = ref(props.formRules);
        const { formColumns, formRules } = toRefs(props);
        watch(form.value, (val) => {
            if (!isEmpty(val.messagingApp) && userInfo.value) {
                formRulesData.value.messagingAppId = [
                    {
                        required: true,
                        message: t(
                            "user-panel.user-info.messagingAppId.warning"
                        ),
                        trigger: "blur",
                    },
                ];
                emit("update:formRules", formRulesData.value);
            } else {
                delete formRulesData.value.messagingAppId;
                emit("update:formRules", formRulesData.value);
            }
            if (
                userInfo.value &&
                formColumns.value &&
                val.messagingApp === "other" &&
                formColumns.value.find(
                    (item) => item.prop === "messagingAppCustomName"
                ) === undefined
            ) {
                userInfo.value.splice(userInfo.value.length - 1, 0, {
                    prop: "messagingAppCustomName",
                    label: "user-panel.user-info.messagingAppCustomName.label",
                    placeholder:
                        "user-panel.user-info.messagingAppCustomName.placeholder",
                    style: "input",
                    span: "4",
                });

                const messagingAppItemIndex = userInfo.value.findIndex(
                    (item) => item.prop === "messagingApp"
                );
                if (messagingAppItemIndex !== -1) {
                    userInfo.value[messagingAppItemIndex].span = "2";
                }
                emit("update:userInfo", userInfo.value);
            } else if (userInfo.value && val.messagingApp !== "other") {
                userInfo.value = userInfo.value.filter(
                    (column) => column.prop !== "messagingAppCustomName"
                );
                delete form.value.messagingAppCustomName;
                const messagingAppItemIndex = userInfo.value.findIndex(
                    (item) => item.prop === "messagingApp"
                );
                if (messagingAppItemIndex !== -1) {
                    userInfo.value[messagingAppItemIndex].span = "6";
                }
                emit("update:userInfo", userInfo.value);
            }
            emit("update:form", val);
        });
        return () => (
            <el-form
                class="custom-form"
                ref={props.formRefDom}
                model={form.value}
                rules={formRulesData.value}
                require-asterisk-position="right"
            >
                <div class="w-full grid grid-cols-12 gap-x-4 gap-y-6">
                    {formColumns.value &&
                        formColumns.value.map((item) => (
                            <el-form-item
                                class={[
                                    item.span
                                        ? `md:col-span-${item.span} col-span-12`
                                        : "md:col-span-6 col-span-12",
                                ]}
                                prop={item.prop as string}
                                label={item.label}
                            >
                                {item.style === "input" && (
                                    <el-input
                                        type={item.type ? item.type : "text"}
                                        show-password={item.showPassword}
                                        disabled={item.disabled}
                                        placeholder={item.placeholder}
                                        v-model={form.value[item.prop]}
                                    ></el-input>
                                )}

                                {item.style === "select" && (
                                    <el-select
                                        v-model={form.value[item.prop]}
                                        placeholder={item.placeholder}
                                        onChange={() =>
                                            item.onChange !== undefined
                                                ? item.onChange!(form.value)
                                                : null
                                        }
                                    >
                                        {item.options &&
                                            item.options.map((option) => (
                                                <el-option
                                                    key={option.value}
                                                    label={option.label}
                                                    value={option.value}
                                                />
                                            ))}
                                    </el-select>
                                )}
                            </el-form-item>
                        ))}
                </div>
            </el-form>
        );
    },
});

export default defineComponent({
    name: "UserInfoView",
    props: {},
    emits: [],
    setup(props, { emit }) {
        const { t } = useI18n();
        const loading = ref(false);
        const formRefDom = ref<FormInstance | null>(null);
        const userStore = useUserStore();
        const initStore = useInitStore();
        const initData = computed(() => initStore.initData);
        const { isMobile } = useWindowResize();
        // 使用者資料
        const user = computed(() => userStore.user);
        // 公司資料
        const company = computed(() => userStore.company);
        // 子帳號資料
        const subAccounts = computed(() => userStore.subAccounts);

        // 使用者資料表單
        const form = ref<UserPanelUserInfoResponseAPIInterface>(user.value);
        // 使用者資料欄位
        const userInfo = ref<FormColumnsInterface[]>([
            {
                prop: "email",
                label: "user-panel.user-info.email.label",
                placeholder: "user-panel.user-info.email.placeholder",
                style: "input",
                disabled: true,
                span: "6",
            },
            {
                prop: "name",
                label: "user-panel.user-info.name.label",
                placeholder: "user-panel.user-info.name.placeholder",
                style: "input",
                span: "6",
            },
            {
                prop: "jobTitle",
                label: "user-panel.user-info.jobTitle.label",
                placeholder: "user-panel.user-info.jobTitle.placeholder",
                style: "input",
                span: "6",
            },
            {
                prop: "phone",
                label: "user-panel.user-info.phone.label",
                placeholder: "user-panel.user-info.phone.placeholder",
                style: "input",
                span: "6",
            },
            {
                prop: "messagingApp",
                label: "user-panel.user-info.messagingApp.label",
                placeholder: "user-panel.user-info.messagingApp.placeholder",
                style: "select",
                span: "6",
                options: [
                    { value: "wechat", label: "wechat" },
                    { value: "line", label: "line" },
                    { value: "whatsapp", label: "whatsapp" },
                    { value: "skype", label: "skype" },
                    { value: "other", label: "other" },
                ],
                onChange(value: UserPanelUserInfoResponseAPIInterface) {
                    return;
                },
            },
            {
                prop: "messagingAppId",
                label: "user-panel.user-info.messagingAppId.label",
                placeholder: "user-panel.user-info.messagingAppId.placeholder",
                style: "input",
                span: "6",
            },
        ]);

        const formColumns = computed<FormColumnsInterface[]>(() =>
            userInfo.value.map((info) => ({
                prop: info.prop,
                label: t(info.label ? info.label : ""),
                placeholder: t(info.placeholder ? info.placeholder : ""),
                style: info.style,
                span: info.span,
                disabled: info.disabled,
                options:
                    info.prop === "messagingApp"
                        ? info.options &&
                          info.options.map((option) => ({
                              value: option.value,
                              label:
                                  option.label === "other"
                                      ? t("global.other")
                                      : option.label,
                          }))
                        : info.options,
                onChange: info.onChange,
            }))
        );

        // 使用者表單驗證
        const formRules = computed(() => {
            return {
                email: [
                    {
                        required: true,
                        message: t("user-panel.user-info.email.warning"),
                        trigger: "blur",
                    },
                ],
                name: [
                    {
                        required: true,
                        message: t("user-panel.user-info.name.warning"),
                        trigger: "blur",
                    },
                ],
                phone: [
                    {
                        required: true,
                        message: t("user-panel.user-info.phone.warning"),
                        trigger: "blur",
                    },
                ],
                jobTitle: [
                    {
                        required: true,
                        message: t("user-panel.user-info.jobTitle.warning"),
                        trigger: "blur",
                    },
                ],
                messagingAppCustomName: [
                    {
                        required: true,
                        message: t(
                            "user-panel.user-info.messagingAppCustomName.warning"
                        ),
                        trigger: "blur",
                    },
                ],
            };
        });

        // 公司資料表單
        const companyForm = ref(company.value);

        // 公司資料欄位
        const companyColumns = computed<
            { prop: "name" | "webURL" | "region" | "address"; label: string }[]
        >(() => {
            const columns: {
                prop: "name" | "webURL" | "region" | "address";
                label: string;
            }[] = [
                {
                    prop: "name",
                    label: t("user-panel.company-info.name"),
                },
                {
                    prop: "webURL",
                    label: t("user-panel.company-info.webURL"),
                },
                {
                    prop: "region",
                    label: t("user-panel.company-info.region"),
                },
                {
                    prop: "address",
                    label: t("user-panel.company-info.address"),
                },
            ];
            if (isEmpty(companyForm.value.webURL)) {
                return columns.filter((column) => column.prop !== "webURL");
            }
            return columns;
        });

        // 子帳號列表表單欄位
        const subAccountsColumns = computed(() => {
            if (Object.keys(subAccounts.value).length > 0) {
                const arr = Object.keys(subAccounts.value).map(
                    (key: string) => {
                        return {
                            label: key,
                            accounts: subAccounts.value[key],
                            memo:
                                t("user-panel.sub-accounts.memo") +
                                " " +
                                initData.value.site.contact_email,
                        };
                    }
                );
                return arr;
            }
            return [];
        });

        /**
         * 表單發送
         */
        async function onSubmit() {
            try {
                if (formRefDom.value) {
                    await formRefDom.value.validate();
                }
                const sendData: UserUpdateProfileRequestAPIInterface = {
                    name: form.value.name!,
                    title: form.value.jobTitle!,
                    phone: form.value.phone!,
                };
                if (
                    form.value.messagingApp &&
                    form.value.messagingAppCustomName
                ) {
                    sendData.im_name = form.value.messagingAppCustomName;
                    sendData.im_account = form.value.messagingAppId;
                } else if (form.value.messagingApp) {
                    sendData.im_name = form.value.messagingApp;
                    sendData.im_account = form.value.messagingAppId;
                }
                await save(sendData);
                return;
            } catch (err) {}
        }

        /**
         * 儲存使用者資料
         * @param formData 使用者表單資料
         */
        async function save(formData: UserUpdateProfileRequestAPIInterface) {
            try {
                await UpdateUserProfileAPI(formData);
                ElMessage({
                    type: "success",
                    message: t("global.success.change"),
                });
                await userStore.getUserPorfile();
            } catch (err) {
                console.log("UpdateUserProfileAPI err =>", err);
            }
        }

        onMounted(() => {
            if (user.value.needSettingProfile) {
                ElMessage({
                    type: "error",
                    duration: 0,
                    message: t(
                        "user-panel.user-info.notifyNeedSettingUserInfo"
                    ),
                });
            }
        });

        return () => {
            // 公司資料區塊
            const CompanySection = (
                <div class="xl:max-w-[1200px] bg-white p-5 border-gray-600 border rounded-[4px]">
                    <h5 class="text-[24px] font-semibold mb-4">
                        {t("user-panel.company-info.title")}
                    </h5>
                    <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 custom-form">
                        {/** 因為資料要完整呈現所以不使用input */}
                        {companyColumns.value &&
                            companyColumns.value.map((item) => (
                                <div
                                    class="el-form-item"
                                    key={"company-" + item.prop}
                                >
                                    <div class="el-form-item__label">
                                        {item.label}
                                    </div>
                                    <div class="el-form-item__content">
                                        <div class="el-input is-disabled">
                                            <div class="el-input__wrapper">
                                                <div class="el-input__inner !h-auto break-all">
                                                    {
                                                        companyForm.value[
                                                            item.prop
                                                        ]
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            );

            // 子帳號列表區塊
            const SubAccountsSection = (
                <div class="w-full flex flex-col gap-6 custom-form mt-8">
                    <div class="w-full h-[1px] bg-black-100 mb-2"></div>
                    {/** 因為資料要完整呈現所以不使用input */}
                    {subAccountsColumns.value.length > 0
                        ? subAccountsColumns.value.map((item) => {
                              if (!isEmpty(item.accounts)) {
                                  return (
                                      <div class="el-form-item">
                                          <div class="el-form-item__label">
                                              {item.label}
                                          </div>
                                          <div class="el-form-item__content">
                                              <div class="el-input is-disabled">
                                                  <div class="el-input__wrapper">
                                                      <div class="el-input__inner !h-auto break-all">
                                                          {item.accounts.join(
                                                              " , "
                                                          )}
                                                      </div>
                                                  </div>
                                              </div>
                                          </div>
                                          <div class="text-[12px] text-red-500 mt-[4px] leading-4">
                                              {item.memo}
                                          </div>
                                      </div>
                                  );
                              }
                          })
                        : null}
                </div>
            );
            return (
                <section>
                    <div class="relative py-[20px] xl:py-[30px] px-[20px] xl:px-[30px]">
                        <div class="xl:max-w-[1300px] mx-auto">
                            <Breadcrumb />
                            <h3 class="text-[28px] font-semibold mb-5 sm:mb-7">
                                {t("router.user-info")}
                            </h3>
                            {/** 公司資料區塊 */}
                            {CompanySection}
                            <div class="xl:max-w-[1200px] bg-white p-5 mt-5 border-gray-600 border rounded-[4px]">
                                <h5 class="text-[24px] font-semibold mb-4">
                                    {t("user-panel.user-info.title")}
                                </h5>
                                {/** 使用者表單資料 */}
                                <UserForm
                                    v-model:form={form.value}
                                    formRefDom={formRefDom.value}
                                    v-model:formColumns={formColumns.value}
                                    v-model:formRules={formRules.value}
                                    v-model:userInfo={userInfo.value}
                                />
                                {/** 子帳號列表區塊 TODO 加判斷(只有主帳號才出出現的區塊) */}
                                {SubAccountsSection}
                                <button
                                    onClick={() => onSubmit()}
                                    class={[
                                        "yellow-btn mt-6",
                                        isMobile.value ? "w-full" : "btn-sm",
                                    ]}
                                >
                                    {t("global.save")}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            );
        };
    },
});
