import { defineComponent, ref, computed } from "vue";
import { useWindowResize } from "@/hooks/windowResize";
import { useUserStore } from "@/stores/userStore";
import { validateEmail } from "@/services/formValidator";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
import type { ColumnsInterface } from "@/interface/global.d";
import GoogleReCaptchaV2 from "@/components/GoogleRecaptchaV2";
import ContactFileUpload from "./ContactFileUpload";

export default defineComponent({
    name: "ContactForm",
    components: {
        GoogleReCaptchaV2,
    },
    setup(props, { emit }) {
        // 聯絡我們表單欄位 key
        type ContactFormPropType = "email" | "name" | "company" | "phone" | "title" | "category" | "content" | "photo";

        const { isMobile } = useWindowResize();
        const userStore = useUserStore();
        const user = computed(() => userStore.user);

        const formRefDom = ref<FormInstance | null>(null);

        const form = ref<any>({
            email: user.value.email,
            name: user.value.name,
            company: user.value.company, //TODO: 目前這個是沒有資料的
            phone: user.value.phone,
            title: "",
            category: "",
            content: "",
            photo: [],
            recaptchaToken: "",
        });

        const rules = ref<any>({
            name: [
                {
                    required: true,
                    message: "請輸入姓名",
                    trigger: "blur",
                },
            ],
            email: [
                {
                    required: true,
                    message: "請輸入電子信箱",
                    trigger: "blur",
                },
                {
                    required: true,
                    validator: validateEmail,
                    trigger: ["change", "blur"],
                    message: "格式不正確",
                },
            ],
            company: [
                {
                    required: true,
                    message: "請輸入公司名稱",
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
            title: [
                {
                    required: true,
                    message: "請選擇主旨",
                    trigger: ["change", "blur"],
                },
            ],
            category: [
                {
                    required: true,
                    message: "請選擇詢問類別",
                    trigger: ["change", "blur"],
                },
            ],
            photo: [
                {
                    required: false,
                    message: "請上傳圖片",
                    trigger: ["change", "blur"],
                },
            ],
            content: [
                {
                    required: true,
                    message: "請輸入詢問內容",
                    trigger: ["change", "blur"],
                },
            ],
        });

        const formColumns = ref<ColumnsInterface<ContactFormPropType>[]>([
            {
                prop: "email",
                label: "帳號(Email)",
                placeholder: "",
                style: "input",
                disabled: true,
            },
            {
                prop: "name",
                label: "會員名稱",
                placeholder: "",
                style: "input",
                disabled: true,
            },
            {
                prop: "company",
                label: "所屬公司",
                placeholder: "",
                style: "input",
                disabled: true,
            },
            {
                prop: "phone",
                label: "聯絡電話",
                placeholder: "請輸入聯絡電話",
                style: "input",
            },
            {
                prop: "title",
                label: "主旨",
                placeholder: "",
                style: "input",
                span: "12",
            },
            {
                prop: "category",
                label: "詢問類別",
                placeholder: "請選擇",
                style: "select",
                options: [],
                span: "12",
            },
            {
                prop: "content",
                label: "詢問內容",
                placeholder: "請輸入詢問內容",
                style: "input",
                row: 4,
                type: "textarea",
                span: "12",
            },
            {
                prop: "photo",
                label: "問題圖片上傳",
                placeholder: "請上傳照片",
                type: "photo",
                style: "file",
                span: "12",
            },
        ]);

        // 取得主旨options
        async function getCategories() {
            try {
                // const { data } = await $api().WorkTypeAPI();
                const data = {
                    options: [
                        { label: "問題回報", value: "1" },
                        { label: "測試", value: "2" },
                        { label: "其他", value: "3" },
                    ],
                };
                const categoryIndex = formColumns.value.findIndex((item) => item.prop === "category");
                if (categoryIndex !== -1) {
                    formColumns.value[categoryIndex].options = data.options;
                }
            } catch (err) {
                console.log("HomeSampleAPI => ", err);
            }
        }

        function handlefile(tempPath: any, prop: string) {
            form.value[prop] = tempPath;
            if (formRefDom.value) {
                formRefDom.value.validateField("photo");
            }
        }

        async function onSubmit() {
            if (!form.value.recaptchaToken) {
                ElMessage({
                    type: "error",
                    message: `請勾選我不是機器人`,
                });
                return;
            }
        }

        return () => (
            <div class="flex-[1.5]">
                <div class="p-5 border border-gray-600 rounded-[4px] bg-white">
                    <h2 class="font-medium mb-2">感謝您的造訪。</h2>
                    <p class="text-[15px] mb-6">
                        請於下方表格說明您的疑問或需求，並留下您的聯絡方式，
                        <br />
                        我們會有專人回覆您的問題。
                    </p>
                    <div class="h-[1px] w-full bg-black-100 mb-6"></div>
                    <el-form class="custom-form" ref="formRefDom" model={form.value} rules={rules.value} require-asterisk-position="right">
                        <div class="w-full grid grid-cols-12 gap-x-4 gap-y-6">
                            {formColumns.value.map((item) => (
                                <el-form-item class={item.span ? `col-span-12 md:col-span-${item.span}` : "col-span-12 md:col-span-6"} prop={item.prop} label={item.label}>
                                    {item.style === "input" && item.row !== undefined && <el-input type={item.type} rows={item.row} show-password={item.showPassword} disabled={item.disabled} placeholder={item.placeholder} v-model={form.value[item.prop]}></el-input>}
                                    {item.style === "input" && item.row === undefined && <el-input type={item.type} rows={item.row} show-password={item.showPassword} disabled={item.disabled} placeholder={item.placeholder} v-model={form.value[item.prop]}></el-input>}

                                    {item.style === "select" && (
                                        <el-select v-model={form.value[item.prop]} placeholder={item.placeholder}>
                                            {item.options && item.options.length > 0 && item.options.map((option) => <el-option key={option.value} label={option.label} value={option.value}></el-option>)}
                                        </el-select>
                                    )}

                                    {item.style === "file" && <ContactFileUpload prop={item.prop} onTempPath={() => handlefile} />}
                                </el-form-item>
                            ))}
                        </div>
                    </el-form>
                    <div class="flex justify-start mt-[30px] mb-[40px]">
                        <GoogleReCaptchaV2 v-model={form.value.recaptchaToken} />
                    </div>
                    <button onClick={() => onSubmit} class={["yellow-btn", isMobile.value ? "w-full" : "btn-sm"]}>
                        送出
                    </button>
                </div>
            </div>
        );
    },
});
