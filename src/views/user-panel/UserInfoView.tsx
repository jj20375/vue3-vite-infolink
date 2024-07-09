import { defineComponent, ref, computed } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useWindowResize } from "@/hooks/windowResize";
import type { FormInstance } from "element-plus";
import type { UserPanelUserInfoInterface } from "./interface/userInterface";
import Breadcrumb from "@/components/Breadcrumb";
export default defineComponent({
    name: "UserInfo",
    props: {},
    emits: [],
    setup(props, { emit }) {
        const loading = ref(false);
        const formRefDom = ref<FormInstance | null>(null);
        const userStore = useUserStore();
        const { isMobile } = useWindowResize();
        // 使用者資料
        const user = computed(() => userStore.user);
        // 公司資料
        const company = computed(() => userStore.company);
        // 子帳號資料
        const subAccounts = computed(() => userStore.subAccounts);

        // 使用者資料表單
        const form = ref<UserPanelUserInfoInterface>({
            email: user.value.email,
            name: user.value.name,
            jobTitle: user.value.jobTitle,
            phone: user.value.phone,
            messagingApp: user.value.messagingApp,
            messagingAppId: user.value.messagingAppId,
        });

        // 使用者資料欄位
        const formColumns = ref<
            {
                type?: string;
                showPassword?: boolean;
                prop: "email" | "name" | "jobTitle" | "phone" | "messagingApp" | "messagingAppCustomName" | "messagingAppId";
                label: string;
                placeholder?: string;
                style: string;
                disabled?: boolean;
                span: string;
                options?: { value: string; label: string }[];
                onChange?: Function | undefined;
            }[]
        >([
            {
                prop: "email",
                label: "帳號(Email)",
                placeholder: "",
                style: "input",
                disabled: true,
                span: "6",
            },
            {
                prop: "name",
                label: "會員名稱",
                placeholder: "請輸入會員名稱",
                style: "input",
                span: "6",
            },
            {
                prop: "jobTitle",
                label: "職稱",
                placeholder: "請輸入職稱",
                style: "input",
                span: "6",
            },
            {
                prop: "phone",
                label: "聯絡電話",
                placeholder: "請輸入聯絡電話",
                style: "input",
                span: "6",
            },
            {
                prop: "messagingApp",
                label: "通訊軟體",
                placeholder: "請選擇",
                style: "select",
                span: "6",
                options: [
                    { value: "wechat", label: "wechat" },
                    { value: "line", label: "line" },
                    { value: "whatsapp", label: "whatsapp" },
                    { value: "skype", label: "skype" },
                    { value: "other", label: "其他" },
                ],
                onChange(value: UserPanelUserInfoInterface) {
                    return;
                },
            },
            {
                prop: "messagingAppId",
                label: "通訊軟體ID",
                style: "input",
                span: "6",
            },
        ]);

        const formRules = ref<any>({
            email: [
                {
                    required: true,
                    message: "請輸入帳號",
                    trigger: "blur",
                },
            ],
            name: [
                {
                    required: true,
                    message: "請輸入會員姓名",
                    trigger: "blur",
                },
            ],
            phone: [
                {
                    required: true,
                    message: "請輸入聯絡電話",
                    trigger: "blur",
                },
            ],
            jobTitle: [
                {
                    required: true,
                    message: "請選擇稱謂",
                    trigger: "blur",
                },
            ],
            messagingAppName: [
                {
                    required: true,
                    message: "請輸入軟體名稱",
                    trigger: "blur",
                },
            ],
        });

        // 公司資料表單
        const companyForm = ref(company.value);

        // 公司資料欄位
        const companyColumns = ref<{ prop: "name" | "webURL" | "region" | "address"; label: string }[]>([
            {
                prop: "name",
                label: "所屬公司",
            },
            {
                prop: "webURL",
                label: "公司網站",
            },
            {
                prop: "region",
                label: "公司所在國家",
            },
            {
                prop: "address",
                label: "公司地址",
            },
        ]);

        // 子帳號資料
        const subAccountsForm = ref(subAccounts.value);
        // 子帳號列表表單欄位
        const subAccountsColumns = ref<{ prop: "solarEnergySubAccounts" | "storedEnergySubAccounts"; label: string; memo: string }[]>([
            {
                prop: "solarEnergySubAccounts",
                label: "子帳號列表-太陽能",
                memo: "* 如須修改，請洽負責業務或來信 service@infolink-group.com",
            },
            {
                prop: "storedEnergySubAccounts",
                label: "子帳號列表-儲能",
                memo: "* 如須修改，請洽負責業務或來信 service@infolink-group.com",
            },
        ]);
        /**
         * 表單發送
         */
        async function onSubmit() {
            try {
                if (formRefDom.value) {
                    await formRefDom.value.validate();
                }
                await save(form.value);
                return;
            } catch (err) {}
        }

        /**
         * 儲存使用者資料
         * @param formData 使用者表單資料
         */
        async function save(formData: UserPanelUserInfoInterface) {
            return;
        }

        return () => (
            <section>
                <div class="relative py-[20px] xl:py-[30px] px-[20px] xl:px-[30px]">
                    <div class="xl:max-w-[1300px] mx-auto">
                        <Breadcrumb class="mb-2" />
                        <h3 class="text-[28px] font-semibold mb-5 sm:mb-7">會員資料管理</h3>
                        <div class="xl:max-w-[1200px] bg-white p-5 border-gray-600 border rounded-[4px]">
                            <h5 class="text-[24px] font-semibold mb-4">公司資訊</h5>
                            <div class="w-full grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 custom-form">
                                {/** 因為資料要完整呈現所以不使用input */}
                                {companyColumns.value &&
                                    companyColumns.value.map((item) => (
                                        <div class="el-form-item" key={"company-" + item.prop}>
                                            <div class="el-form-item__label">{item.label}</div>
                                            <div class="el-form-item__content">
                                                <div class="el-input is-disabled">
                                                    <div class="el-input__wrapper">
                                                        <div class="el-input__inner !h-auto break-all">{companyForm.value[item.prop]}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div class="xl:max-w-[1200px] bg-white p-5 mt-5 border-gray-600 border rounded-[4px]">
                            <h5 class="text-[24px] font-semibold mb-4">個人資訊</h5>
                            <el-form class="custom-form" ref={formRefDom.value} model={form.value} rules={formRules.value} require-asterisk-position="right">
                                <div class="w-full grid grid-cols-12 gap-x-4 gap-y-6">
                                    {formColumns.value &&
                                        formColumns.value.map((item) => (
                                            <el-form-item class="md:col-span-6 col-span-12" prop={item.prop as string} label={item.label}>
                                                {item.style === "input" && <el-input type={item.type ? item.type : "text"} show-password={item.showPassword} disabled={item.disabled} placeholder={item.placeholder} v-model={form.value[item.prop]}></el-input>}

                                                {item.style === "select" && (
                                                    <el-select v-model={form.value[item.prop]} placeholder={item.placeholder} v-on:change={item.onChange !== undefined ? () => item.onChange!(form.value) : null}>
                                                        {item.options && item.options.map((option) => <el-option key={option.value} label={option.label} value={option.value} />)}
                                                    </el-select>
                                                )}
                                            </el-form-item>
                                        ))}
                                </div>
                            </el-form>
                            {/** TODO 加判斷(只有主帳號才出出現的區塊) */}
                            <div class="w-full flex flex-col gap-6 custom-form mt-8">
                                <div class="w-full h-[1px] bg-black-100 mb-2"></div>
                                {/** 因為資料要完整呈現所以不使用input */}
                                {subAccountsColumns.value &&
                                    subAccountsColumns.value.map((subAccountColumn) => (
                                        <div class="el-form-item">
                                            <div class="el-form-item__label">{subAccountColumn.label}</div>
                                            <div class="el-form-item__content">
                                                <div class="el-input is-disabled">
                                                    <div class="el-input__wrapper">
                                                        <div class="el-input__inner !h-auto break-all">{subAccountsForm.value[subAccountColumn.prop]!.join(" , ")}</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="text-[12px] text-red-500 mt-[4px] leading-4">{subAccountColumn.memo}</div>
                                        </div>
                                    ))}
                            </div>
                            <button v-on:click_prevent={() => onSubmit()} class={["yellow-btn mt-6", isMobile.value ? "w-full" : "btn-sm"]}>
                                儲存
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    },
});
