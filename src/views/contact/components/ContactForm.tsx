import { defineComponent, ref, computed, onMounted } from "vue";
import { useWindowResize } from "@/hooks/windowResize";
import { useUserStore } from "@/stores/userStore";
import { validateEmail } from "@/services/formValidator";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import type { ColumnsInterface, OptionsInterface } from "@/interface/global.d";
import GoogleReCaptchaV2 from "@/components/GoogleRecaptchaV2";
import Hcaptcha from "@/components/Hcaptcha";
import ContactFileUpload from "./ContactFileUpload";
import { useI18n } from "vue-i18n";
import {
    ContactUsFormAPI,
    GetContactUsQuestionCategoriesAPI,
} from "@/api/contactAPI";
import { isEmpty } from "@/services/utils";
import type { ContactUsFormRequestAPIInterface } from "../contactInterface";
import { useRouter } from "vue-router";

export default defineComponent({
    name: "ContactForm",
    components: {
        GoogleReCaptchaV2,
        Hcaptcha,
    },
    setup(props, { emit }) {
        const { t } = useI18n();
        // 聯絡我們表單欄位 key
        type ContactFormPropType =
            | "email"
            | "name"
            | "company"
            | "phone"
            | "title"
            | "category"
            | "content"
            | "photo";

        const { isMobile } = useWindowResize();
        const router = useRouter();
        const userStore = useUserStore();
        const user = computed(() => userStore.user);
        const company = computed(() => userStore.company);

        const formRefDom = ref<FormInstance | null>(null);

        const form = ref<any>({
            email: user.value.email,
            name: user.value.name,
            company: company.value.name,
            phone: user.value.phone,
            title: "",
            category: "",
            content: "",
            photo: [],
            // google recaptcha token 暫時棄用 因為考量中國客戶問題
            recaptchaToken: "",
            // 替代 google recaptcha token 機制
            hcaptchaToken: "",
        });

        const rules = computed<any>(() => {
            return {
                name: [
                    {
                        required: true,
                        message: t("contact.name.warning"),
                        trigger: "blur",
                    },
                ],
                email: [
                    {
                        required: true,
                        message: t("contact.email.warning"),
                        trigger: "blur",
                    },
                    {
                        required: true,
                        validator: validateEmail,
                        trigger: ["change", "blur"],
                        message: t("contact.email.invalid"),
                    },
                ],
                company: [
                    {
                        required: true,
                        message: t("contact.company.warning"),
                        trigger: "blur",
                    },
                ],
                phone: [
                    {
                        required: true,
                        message: t("contact.phone.warning"),
                        trigger: "blur",
                    },
                ],
                title: [
                    {
                        required: true,
                        message: t("contact.title.warning"),
                        trigger: ["change", "blur"],
                    },
                ],
                category: [
                    {
                        required: true,
                        message: t("contact.category.warning"),
                        trigger: ["change", "blur"],
                    },
                ],
                photo: [
                    {
                        required: false,
                        message: t("contact.photo.warning"),
                        trigger: ["change", "blur"],
                    },
                ],
                content: [
                    {
                        required: true,
                        message: t("contact.content.warning"),
                        trigger: ["change", "blur"],
                    },
                ],
            };
        });

        const categories = ref<OptionsInterface[]>([]);

        const formColumns = computed<ColumnsInterface<ContactFormPropType>[]>(
            () => {
                const datas: ColumnsInterface<ContactFormPropType>[] = [
                    {
                        prop: "email",
                        label: t("contact.email.label"),
                        placeholder: t("contact.email.placeholder"),
                        style: "input",
                        disabled: true,
                    },
                    {
                        prop: "name",
                        label: t("contact.name.label"),
                        placeholder: t("contact.name.placeholder"),
                        style: "input",
                        disabled: true,
                    },
                    {
                        prop: "company",
                        label: t("contact.company.label"),
                        placeholder: t("contact.company.placeholder"),
                        style: "input",
                        disabled: true,
                    },
                    {
                        prop: "phone",
                        label: t("contact.phone.label"),
                        placeholder: t("contact.phone.placeholder"),
                        style: "input",
                    },
                    {
                        prop: "title",
                        label: t("contact.title.label"),
                        placeholder: t("contact.title.placeholder"),
                        style: "input",
                        span: "12",
                    },
                    {
                        prop: "category",
                        label: t("contact.category.label"),
                        placeholder: t("contact.category.placeholder"),
                        style: "select",
                        options: categories.value,
                        span: "12",
                    },
                    {
                        prop: "content",
                        label: t("contact.content.label"),
                        placeholder: t("contact.content.placeholder"),
                        style: "input",
                        row: 4,
                        type: "textarea",
                        span: "12",
                    },
                    {
                        prop: "photo",
                        label: t("contact.photo.label"),
                        placeholder: t("contact.photo.placeholder"),
                        type: "photo",
                        style: "file",
                        span: "12",
                    },
                ];
                return datas;
            }
        );

        /**
         * 取得聯絡我們詢問類別
         */
        async function getContactUsQuestionCategories() {
            try {
                const { data } = await GetContactUsQuestionCategoriesAPI();
                categories.value = data.data.map((item) => {
                    return {
                        label: item.name,
                        value: item.id,
                    };
                });
            } catch (err) {
                console.log("GetContactUsQuestionCategoriesAPI err =>", err);
            }
        }

        function handlefile(tempPath: any, prop: string) {
            form.value[prop] = tempPath;
        }

        async function onSubmit(e: Event) {
            e.preventDefault();
            // 判斷 google recaptcha token 此機制放棄 因為中國客戶考量
            // if (isEmpty(form.value.recaptchaToken)) {
            //     ElMessage({
            //         type: "error",
            //         message: t("contact.recaptchaValidation"),
            //     });
            //     return;
            // }
            // hcaptcha 改為替代 googel recaptcha 驗證
            if (isEmpty(form.value.hcaptchaToken)) {
                ElMessage({
                    type: "error",
                    message: t("contact.recaptchaValidation"),
                });
                return;
            }
            const sendData: ContactUsFormRequestAPIInterface = {
                // 詢問類別
                contact_category_id: form.value.category,
                // 手機號碼
                phone: form.value.phone,
                // 主旨
                subject: form.value.title,
                // 內容
                content: form.value.content,
                // 聯絡我們圖片
                attachments: form.value.photo,
            };
            if (isEmpty(sendData.attachments)) {
                delete sendData.attachments;
            }
            if (formRefDom.value) {
                try {
                    await formRefDom.value.validate();
                    await contactUs(sendData);
                } catch (err) {
                    throw err;
                }
            }
        }

        /**
         * 聯絡我們表單發送
         * @param form
         */
        async function contactUs(form: ContactUsFormRequestAPIInterface) {
            try {
                await ContactUsFormAPI(form);
                router.push({
                    name: "contact-success",
                    params: { slug: t("router.contact-success") },
                });
            } catch (err) {
                console.log("ContactUsFormAPI err =>", err);
            }
        }

        onMounted(async () => {
            await getContactUsQuestionCategories();
        });

        return () => (
            <div class="flex-[1.5]">
                <div class="p-5 border border-gray-600 rounded-[4px] bg-white">
                    <h2 class="font-medium mb-2">{t("contact.greeting")}</h2>
                    <p class="text-[15px] mb-6">{t("contact.description")}</p>
                    <div class="h-[1px] w-full bg-black-100 mb-6"></div>
                    <el-form
                        class="custom-form"
                        ref={formRefDom}
                        model={form.value}
                        rules={rules.value}
                        require-asterisk-position="right"
                    >
                        <div class="w-full grid grid-cols-12 gap-x-4 gap-y-6">
                            {formColumns.value.map((item) => (
                                <el-form-item
                                    class={
                                        item.span
                                            ? `col-span-12 md:col-span-${item.span}`
                                            : "col-span-12 md:col-span-6"
                                    }
                                    prop={item.prop}
                                    label={item.label}
                                >
                                    {item.style === "input" &&
                                        item.row !== undefined && (
                                            <el-input
                                                type={item.type}
                                                rows={item.row}
                                                show-password={
                                                    item.showPassword
                                                }
                                                disabled={item.disabled}
                                                placeholder={item.placeholder}
                                                v-model={form.value[item.prop]}
                                            ></el-input>
                                        )}
                                    {item.style === "input" &&
                                        item.row === undefined && (
                                            <el-input
                                                type={item.type}
                                                rows={item.row}
                                                show-password={
                                                    item.showPassword
                                                }
                                                disabled={item.disabled}
                                                placeholder={item.placeholder}
                                                v-model={form.value[item.prop]}
                                            ></el-input>
                                        )}

                                    {item.style === "select" && (
                                        <el-select
                                            v-model={form.value[item.prop]}
                                            placeholder={item.placeholder}
                                        >
                                            {item.options &&
                                                item.options.length > 0 &&
                                                item.options.map((option) => (
                                                    <el-option
                                                        key={option.value}
                                                        label={option.label}
                                                        value={option.value}
                                                    ></el-option>
                                                ))}
                                        </el-select>
                                    )}

                                    {item.style === "file" && (
                                        <ContactFileUpload
                                            prop={item.prop}
                                            onTempPath={handlefile}
                                        />
                                    )}
                                </el-form-item>
                            ))}
                        </div>
                    </el-form>
                    <div class="flex justify-start mt-[30px] mb-[40px]">
                        {/* <GoogleReCaptchaV2
                            v-model={form.value.recaptchaToken}
                        /> */}
                        <Hcaptcha v-model={form.value.hcaptchaToken} />
                    </div>
                    <button
                        onClick={onSubmit}
                        class={[
                            "yellow-btn",
                            isMobile.value ? "w-full" : "btn-sm",
                        ]}
                    >
                        {t("global.submit")}
                    </button>
                </div>
            </div>
        );
    },
});
