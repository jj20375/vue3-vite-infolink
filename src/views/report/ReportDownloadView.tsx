import type { PropType } from "vue";
import type { OptionsInterface } from "@/interface/global.d";
import type { ReportDownloadFilterColumnsInterface, ReportDownloadDataInterface } from "./interface/reportDownloadInterface.d";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { defineComponent, ref, markRaw, watch } from "vue";
import { useRoute } from "vue-router";
import { useWindowResize } from "@/hooks/windowResize";
import Breadcrumb from "@/components/Breadcrumb";
import IconSearch from "@/components/icons/IconSearch.vue";
import IconReset from "@/components/icons/IconReset.vue";
import IconDownload from "@/components/icons/IconDownload.vue";
import ReportDownloadTable from "./components/ReportDownloadTable";
import Pagination from "@/components/Pagination.vue";

interface FilterInterFace {
    // 產業別
    industry?: string[];
    // 報告語系
    language?: string[];
    // 期數
    period?: string[];
    // 報告名稱(分類)
    category?: string[];
    // 搜尋名稱
    name?: string;
}

// 預設搜尋條件值
const defaultFilter = { industry: [], language: [], period: [], category: [], name: "" };

const ReportSearch = defineComponent({
    name: "ReportSearch",
    props: {
        searchFilter: {
            type: Object as PropType<FilterInterFace>,
            default: () => defaultFilter,
        },
    },
    emits: ["update:searchFilter"],
    setup(props, { emit, attrs }) {
        const { isLargePad } = useWindowResize();

        const filterForm = ref<FilterInterFace | any>(props.searchFilter);

        const industryOptions = ref<OptionsInterface[]>([
            {
                label: "太陽能",
                value: "太陽能",
            },
            {
                label: "風能",
                value: "風能",
            },
            {
                label: "儲能",
                value: "儲能",
            },
            {
                label: "電動車",
                value: "電動車",
            },
            {
                label: "氫能",
                value: "氫能",
            },
            {
                label: "石油",
                value: "石油",
            },
            {
                label: "天然氣",
                value: "天然氣",
            },
            {
                label: "煤炭",
                value: "煤炭",
            },
            {
                label: "核能",
                value: "核能",
            },
            {
                label: "其他",
                value: "其他",
            },
        ]);

        const languageOptions = ref<OptionsInterface[]>([
            {
                label: "繁體中文",
                value: "繁體中文",
            },
            {
                label: "簡體中文",
                value: "簡體中文",
            },
            {
                label: "英文",
                value: "英文",
            },
        ]);

        const categoryOptions = ref<OptionsInterface[]>([
            {
                label: "產業鍊價格預測月報告",
                value: "產業鍊價格預測月報告",
            },
            {
                label: "行業鍊開工率統計調研",
                value: "行業鍊開工率統計調研",
            },
        ]);

        // 搜尋條件欄位
        const filterColumns = ref<ReportDownloadFilterColumnsInterface[]>([
            {
                prop: "industry",
                label: "產業別",
                placeholder: "選擇產業",
                style: "muti-select",
                options: industryOptions.value,
            },
            {
                prop: "language",
                label: "報告語系",
                placeholder: "選擇語系",
                style: "muti-select",
                options: languageOptions.value,
            },
            {
                prop: "period",
                label: "期數",
                style: "datepicker",
            },
            {
                prop: "category",
                label: "報告名稱",
                placeholder: "選擇報告名稱",
                style: "muti-select",
                options: categoryOptions.value,
            },
            {
                prop: "name",
                label: " ",
                mobileHideLabel: true,
                placeholder: "搜尋報告名稱",
                style: "input",
                iconName: markRaw(IconSearch),
            },
        ]);

        // 多選選單新增全部按鈕
        const checkAll = ref(filterColumns.value.filter((item: any) => item).map(() => false));

        const handleCheckAll = (item: any, index: number) => {
            if (checkAll.value[index]) {
                filterForm.value[item.prop] = item.options.map((option: any) => option.value);
            } else {
                filterForm.value[item.prop] = [];
            }
            emit("update:searchFilter");
        };

        // 多選選單選項改變時，判斷是否全選
        const handleOptionChange = (item: any, index: number) => {
            if (filterForm.value[item.prop].length !== item.options.length && filterForm.value[item.prop].length !== 0) {
                checkAll.value[index] = false;
            } else if (filterForm.value[item.prop].length === item.options.length) {
                checkAll.value[index] = true;
            }
            emit("update:searchFilter");
        };

        watch(filterForm.value, (val) => {
            emit("update:searchFilter", val);
        });

        function onSubmit(val: FilterInterFace) {
            emit("update:searchFilter", val);
        }

        function resetFilter(val: FilterInterFace) {
            filterForm.value = defaultFilter;
            emit("update:searchFilter", val);
        }

        return () => (
            <div class="custom-form w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-y-6 gap-x-4">
                {filterColumns.value.map((item, index) => (
                    <el-form-item prop={item.prop} label={item.mobileHideLabel && isLargePad.value ? null : item.label}>
                        {item.style === "input" && (
                            <el-input type={item.type ? item.type : "text"} show-password={item.showPassword ? item.showPassword : false} disabled={item.disabled} placeholder={item.placeholder} v-model={filterForm.value[item.prop]}>
                                {{ prefix: () => <item.iconName class="!w-[20px] !h-[20px] !mr-3 text-black-300" /> }}
                            </el-input>
                        )}
                        {item.style === "muti-select" && (
                            <el-select class="w-full" multiple collapse-tags collapse-tags-tooltip max-collapse-tags={2} v-model={filterForm.value[item.prop]} placeholder={item.placeholder} onChange={() => handleOptionChange(item, index)}>
                                {{
                                    header: () => (
                                        <el-checkbox class="w-full" v-model={checkAll.value[index]} onChange={() => handleCheckAll(item, index)}>
                                            全部
                                        </el-checkbox>
                                    ),
                                    default: () => {
                                        return item.options && item.options.map((option) => <el-option key={option.value} label={option.label} value={option.value} />);
                                    },
                                }}
                            </el-select>
                        )}
                        {item.style === "datepicker" && <el-date-picker v-model={filterForm.value[item.prop]} type="daterange" valueFormat="YYYY-MM-DD" start-placeholder="開始日期" end-placeholder="結束日期" disabled={item.disabled} placeholder={item.placeholder} popper-class="date-box" />}
                    </el-form-item>
                ))}
                <div class="flex flex-col gap-4 sm:block">
                    <div class="hidden xl:block xl:h-[40px]"></div>
                    <div class="flex sm:inline-flex gap-2 justify-center items-center yellow-btn" onClick={() => onSubmit(filterForm.value)}>
                        <IconSearch class="text-black-900" />
                        查詢
                    </div>
                    <div class="flex sm:inline-flex gap-2 justify-center items-center transparent-btn" onClick={() => resetFilter(filterForm.value)}>
                        <IconReset class="text-black-900" />
                        重置
                    </div>
                </div>
            </div>
        );
    },
});

export default defineComponent({
    name: "ReportDownloadView",
    components: { Breadcrumb },
    props: {},
    emits: [],
    setup(props, { emit, attrs }) {
        const route: RouteLocationNormalizedLoaded = useRoute();
        // 解析搜尋條件
        let parseRouterParams: { [key: string]: string } = {};
        // 判斷是否有搜尋條件
        if (route.params.chapters && route.params.chapters.length > 0) {
            const arr: string[] = route.params.chapters as string[];
            // 將搜尋條件 轉換成物件
            parseRouterParams = arr.reduce((acc: any, item: any) => {
                const [key, value] = item.split(":");
                acc[key] = value;
                return acc;
            }, {});
        }
        // 將搜尋條件字串話
        let stringifyRouterParams: string[] = Object.entries(parseRouterParams).map(([key, value]) => `${key}:${value}`);
        console.log(route.name, "=>", route.params, parseRouterParams, stringifyRouterParams);

        // 搜尋條件表單
        const filterForm = ref<FilterInterFace>(defaultFilter);

        // 表格資料
        const tableHeadData = ref(["產業別", "語系", "報告名稱", "期數", "檔案類型", "發布時間", "下載次數"]);
        const tableBodyData = ref<ReportDownloadDataInterface[]>([
            {
                id: 1,
                name: "2021年太陽能產業鍊價格預測月報告",
                industry: "太陽能",
                language: "繁體中文",
                period: "2021-01",
                publishTime: "2021-01-01",
                downloadCount: 10,
                fileType: ["pdf", "xlsx", "xlsm"],
                path: {
                    name: "report-download-detail",
                    params: { slug: "報告資訊", id: 1 },
                },
            },
            {
                id: 2,
                name: "2024年太陽能產業鍊價格預測月報告",
                industry: "太陽能",
                language: "繁體中文",
                period: "2024-01",
                publishTime: "2024-01-01",
                downloadCount: 5,
                fileType: ["xlsm"],
                path: {
                    name: "report-download-detail",
                    params: { slug: "報告資訊", id: 2 },
                },
            },
        ]);

        // 檔案下載資料
        const downloadManualData = ref<any>({
            chinese: "https://www.google.com.tw/webhp?hl=zh-TW",
            english: "https://www.google.com.tw/webhp?hl=zh-TW",
        });

        const currentPage = ref(1);

        function handlePageChange(val: any) {}

        return () => (
            <section>
                <div class="relative py-[20px] xl:py-[30px] px-[20px] xl:px-[30px]">
                    <div class="mb-2">
                        <Breadcrumb />
                    </div>
                    <h3 class="text-[28px] font-semibold mb-5 sm:mb-7">報告下載</h3>
                    <div class="xl:max-w-[1200px]">
                        <ReportSearch searchFilter={filterForm.value} />
                        <div class="mt-3 sm:mt-12 border border-gray-600 p-5 rounded-[4px] bg-white">
                            <div class="flex flex-col sm:flex-row gap-1 sm:gap-4 justify-end mb-5">
                                {downloadManualData.value.chinese !== undefined && (
                                    <a target="_blank" href={downloadManualData.value.chinese} class="flex gap-2 p-2 items-center text-[14px] cursor-pointer hover:text-black-700 transition-all duration-300">
                                        <IconDownload class="!w-4 !h-4" />
                                        巨集使用說明書(中文)
                                    </a>
                                )}
                                {downloadManualData.value.english !== undefined && (
                                    <a target="_blank" href={downloadManualData.value.english} class="flex gap-2 p-2 items-center text-[14px] cursor-pointer hover:text-black-700 transition-all duration-300">
                                        <IconDownload class="!w-4 !h-4" />
                                        巨集使用說明書(英文)
                                    </a>
                                )}
                            </div>
                            <ReportDownloadTable tableHeadData={tableHeadData.value} tableBodyData={tableBodyData.value} />
                            <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mt-6">
                                <div class="order-2 lg:order-1 text-[14px]">共有 32 筆資料，第 1 / 10 頁</div>
                                <Pagination class="order-1 lg:order-2 mb-4 lg:mb-0" total={100} pageSize={10} page={currentPage.value} v-on:handlePageChange={() => handlePageChange(1)} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    },
});
