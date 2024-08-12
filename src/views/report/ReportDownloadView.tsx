import type { PropType } from "vue";
import type { OptionsInterface } from "@/interface/global.d";
import type {
    ReportDownloadFilterColumnsInterface,
    ReportDownloadDataInterface,
    ReportDownloadParamsInterface,
    ReportDownloadDataListResponseAPIInterface,
    ReportDownloadLanguagesAPIInterface,
    ReportDownloadCategoriesAPIInterface,
    ReportDownloadIndustriesAPIInterface,
    ReportDownloadManualResponseAPIInterface,
    ReportDownloadManualInterface,
} from "./interface/reportDownloadInterface.d";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { defineComponent, ref, markRaw, watch, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWindowResize } from "@/hooks/windowResize";
import Breadcrumb from "@/components/Breadcrumb";
import IconSearch from "@/components/icons/IconSearch.vue";
import IconReset from "@/components/icons/IconReset.vue";
import IconDownload from "@/components/icons/IconDownload.vue";
import ReportDownloadTable from "./components/ReportDownloadTable";
import Pagination from "@/components/Pagination.vue";
import { useI18n } from "vue-i18n";
import { isEmpty } from "@/services/utils";
import {
    GetReportListAPI,
    GetReportLanguagesAPI,
    GetReportIndustriesAPI,
    GetReportCategoriesAPI,
    GetReportDownloadManualListAPI,
} from "@/api/reportAPI";

interface FilterInterFace {
    // 產業別
    industry?: number[];
    // 報告語系
    language?: string[];
    // 期數
    period?: string[];
    // 報告名稱(分類)
    category?: number[];
    // 搜尋名稱
    name?: string;
}

// 預設搜尋條件值
const defaultFilter = function () {
    return { industry: [], language: [], period: [], category: [], name: "" };
};

const ReportSearch = defineComponent({
    name: "ReportSearch",
    props: {
        searchFilter: {
            type: Object as PropType<FilterInterFace>,
            default: () => defaultFilter(),
        },
    },
    emits: ["searchFilter"],
    setup(props, { emit, attrs }) {
        const { t } = useI18n();

        const { isLargePad } = useWindowResize();

        const filterForm = ref<FilterInterFace | any>(props.searchFilter);

        const industryOptions = ref<OptionsInterface[]>([]);

        const languageOptions = ref<OptionsInterface[]>([]);

        const categoryOptions = ref<OptionsInterface[]>([]);

        // 搜尋條件欄位
        const filterColumns = computed<ReportDownloadFilterColumnsInterface[]>(
            () => [
                {
                    prop: "industry",
                    label: t("report-download.industry.label"),
                    placeholder: t("report-download.industry.placeholder"),
                    style: "muti-select",
                    options: industryOptions.value,
                },
                {
                    prop: "language",
                    label: t("report-download.language.label"),
                    placeholder: t("report-download.language.placeholder"),
                    style: "muti-select",
                    options: languageOptions.value,
                },
                {
                    prop: "period",
                    label: t("report-download.period.label"),
                    style: "datepicker",
                    placeholderStart: t(
                        "report-download.period.placeholderStart"
                    ),
                    placeholderEnd: t("report-download.period.placeholderEnd"),
                },
                {
                    prop: "category",
                    label: t("report-download.category.label"),
                    placeholder: t("report-download.category.placeholder"),
                    style: "muti-select",
                    options: categoryOptions.value,
                },
                {
                    prop: "name",
                    label: t("report-download.name.label"),
                    mobileHideLabel: true,
                    placeholder: t("report-download.name.placeholder"),
                    style: "input",
                    iconName: markRaw(IconSearch),
                },
            ]
        );

        // 多選選單新增全部按鈕
        const checkAll = ref(
            filterColumns.value.filter((item: any) => item).map(() => false)
        );

        const handleCheckAll = (item: any, index: number) => {
            if (checkAll.value[index]) {
                filterForm.value[item.prop] = item.options.map(
                    (option: any) => option.value
                );
            } else {
                filterForm.value[item.prop] = [];
            }
            emit("searchFilter", { ...filterForm.value, page: 1 });
        };

        // 多選選單選項改變時，判斷是否全選
        const handleOptionChange = (item: any, index: number) => {
            if (
                filterForm.value[item.prop].length !== item.options.length &&
                filterForm.value[item.prop].length !== 0
            ) {
                checkAll.value[index] = false;
            } else if (
                filterForm.value[item.prop].length === item.options.length
            ) {
                checkAll.value[index] = true;
            }
            emit("searchFilter", { ...filterForm.value, page: 1 });
        };
        function onSubmit(val: FilterInterFace) {
            emit("searchFilter", { ...val, page: 1 });
        }

        function resetFilter() {
            filterForm.value = defaultFilter();
            emit("searchFilter", { ...filterForm.value, page: 1 });
        }

        /**
         * 取得報告語系下拉資料
         */
        async function getReportLanguages() {
            try {
                const { data }: ReportDownloadLanguagesAPIInterface =
                    await GetReportLanguagesAPI();

                const langs: { label: string; value: any }[] = [];
                Object.keys(data.data).forEach((key) => {
                    langs.push({
                        label: data.data[key],
                        value: key,
                    });
                });
                languageOptions.value = langs;
            } catch (err) {
                console.log("GetReportLanguagesAPI err =>", err);
            }
        }

        /**
         * 取得報告產業別下拉資料
         */
        async function getReportIndustries() {
            try {
                const { data }: ReportDownloadIndustriesAPIInterface =
                    await GetReportIndustriesAPI();

                industryOptions.value = data.data.map((item) => {
                    return {
                        label: item.name,
                        value: item.id,
                    };
                });
            } catch (err) {
                console.log("GetReportIndustriesAPI err =>", err);
            }
        }

        /**
         * 取得報告名稱下拉資料
         */
        async function getReportCategories() {
            try {
                const { data }: ReportDownloadCategoriesAPIInterface =
                    await GetReportCategoriesAPI();

                categoryOptions.value = data.data.map((item) => {
                    return {
                        label: item.name,
                        value: item.id,
                    };
                });
            } catch (err) {
                console.log("GetReportCategoriesAPI err =>", err);
            }
        }

        watch(
            () => props.searchFilter,
            (val) => {
                filterForm.value = val;
                emit("searchFilter", val);
            }
        );
        onMounted(async () => {
            await getReportLanguages();
            await getReportIndustries();
            await getReportCategories();
        });

        return () => (
            <div class="custom-form w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-y-6 gap-x-4">
                {filterColumns.value.map((item, index) => (
                    <el-form-item
                        prop={item.prop}
                        label={
                            item.mobileHideLabel && isLargePad.value
                                ? null
                                : item.label
                        }
                    >
                        {item.style === "input" && (
                            <el-input
                                type={item.type ? item.type : "text"}
                                show-password={
                                    item.showPassword
                                        ? item.showPassword
                                        : false
                                }
                                disabled={item.disabled}
                                placeholder={item.placeholder}
                                v-model={filterForm.value[item.prop]}
                            >
                                {{
                                    prefix: () => (
                                        <item.iconName class="!w-[20px] !h-[20px] !mr-3 text-black-300" />
                                    ),
                                }}
                            </el-input>
                        )}
                        {item.style === "muti-select" && (
                            <el-select
                                class="w-full"
                                multiple
                                collapse-tags
                                collapse-tags-tooltip
                                max-collapse-tags={2}
                                v-model={filterForm.value[item.prop]}
                                placeholder={item.placeholder}
                                onChange={() => handleOptionChange(item, index)}
                            >
                                {{
                                    header: () => (
                                        <el-checkbox
                                            class="w-full"
                                            v-model={checkAll.value[index]}
                                            onChange={() =>
                                                handleCheckAll(item, index)
                                            }
                                        >
                                            {t("global.all")}
                                        </el-checkbox>
                                    ),
                                    default: () => {
                                        return (
                                            item.options &&
                                            item.options.map((option) => (
                                                <el-option
                                                    key={option.value}
                                                    label={option.label}
                                                    value={option.value}
                                                />
                                            ))
                                        );
                                    },
                                }}
                            </el-select>
                        )}
                        {item.style === "datepicker" && (
                            <el-date-picker
                                v-model={filterForm.value[item.prop]}
                                type="daterange"
                                valueFormat="YYYY-MM-DD"
                                start-placeholder={item.placeholderStart}
                                end-placeholder={item.placeholderEnd}
                                disabled={item.disabled}
                                placeholder={item.placeholder}
                                popper-class="date-box"
                            />
                        )}
                    </el-form-item>
                ))}
                <div class="flex flex-col gap-4 sm:block">
                    <div class="hidden xl:block xl:h-[40px]"></div>
                    <div
                        class="flex sm:inline-flex gap-2 justify-center items-center yellow-btn"
                        onClick={() => onSubmit(filterForm.value)}
                    >
                        <IconSearch class="text-black-900" />
                        {t("global.search")}
                    </div>
                    <div
                        class="flex sm:inline-flex gap-2 justify-center items-center transparent-btn"
                        onClick={() => resetFilter()}
                    >
                        <IconReset class="text-black-900" />
                        {t("global.reset")}
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
        const { t, locale } = useI18n();
        const route: RouteLocationNormalizedLoaded = useRoute();
        const router = useRouter();
        const loading = ref(false);

        // 搜尋條件表單
        const filterForm = ref<FilterInterFace>(defaultFilter());

        // 表格資料
        const tableHeadData = computed(() => [
            t("report-download.table.industry"),
            t("report-download.table.language"),
            t("report-download.table.reportName"),
            t("report-download.table.period"),
            t("report-download.table.fileType"),
            t("report-download.table.publishTime"),
            t("report-download.table.downloadCount"),
        ]);
        const tableBodyData = ref<ReportDownloadDataInterface[]>([]);

        // 檔案下載資料
        const downloadManualData = ref<ReportDownloadManualInterface>({
            name: t("report-download.manual.name"),
            path: {
                en: "",
                zh_CN: "",
            },
        });

        const currentPage = ref(1);
        const pagination = ref({
            pageSize: 10,
            total: 1,
        });

        /**
         * 取得報告說明書下載列表
         */
        async function getManual() {
            try {
                const { data }: ReportDownloadManualResponseAPIInterface =
                    await GetReportDownloadManualListAPI();
                downloadManualData.value.path = data.data[0].path;
            } catch (err) {
                console.log("GetReportDownloadManualListAPI err =>", err);
            }
        }

        async function handlePageChange(val: number) {
            currentPage.value = val;

            await onFilter({ ...filterForm.value, page: currentPage.value });
        }

        async function getList(params: ReportDownloadParamsInterface | void) {
            loading.value = true;
            try {
                const { data }: ReportDownloadDataListResponseAPIInterface =
                    await GetReportListAPI(params);
                tableBodyData.value = data.data.rows.map((row) => {
                    let fileTypes: any = [];
                    if (!isEmpty(row.files)) {
                        fileTypes = Object.keys(row.files).map((fileType) => {
                            return fileType;
                        });
                    }

                    return {
                        id: row.id,
                        name: row.name,
                        industry: row.report_industry,
                        language: row.language,
                        period: row.period,
                        publishTime: row.published_at,
                        downloadCount: row.download_count,
                        fileTypes: fileTypes,
                        path: {
                            name: "report-download-detail",
                            params: {
                                slug: t("router.report-download-detail"),
                                id: row.id,
                            },
                        },
                    };
                });
                pagination.value = {
                    pageSize: data.data.meta.limit,
                    total: data.data.meta.total,
                };
                currentPage.value = data.data.meta.current_page;
            } catch (err) {
                console.log("GetReportListAPI err =>", err);
            } finally {
                loading.value = false;
            }
        }

        /**
         * 搜尋條件取得列表資料
         * @param val
         */
        async function onFilter(val: FilterInterFace & { page?: number }) {
            if (!isEmpty(val.page)) {
                currentPage.value = val.page!;
            }
            filterForm.value = val;
            const params: ReportDownloadParamsInterface | any = {
                keyword: val.name,
                languages: val.language,
                report_industry_ids: Array.isArray(val.industry)
                    ? val.industry
                    : [],
                report_category_ids: Array.isArray(val.category)
                    ? val.category
                    : [],
                start_period: Array.isArray(val.period) ? val.period[0] : "",
                end_period: Array.isArray(val.period) ? val.period[1] : "",
                page: val.page,
            };
            // 刪除空的搜尋條件
            Object.keys(params).forEach((key) => {
                if (isEmpty(params[key])) {
                    delete params[key];
                }
            });
            // 判斷有搜尋條件時 需 加上 chapters 網址路徑 往後重整畫面時 需解析是否有參數值 並帶上搜尋參數
            if (Object.keys(params).length > 0) {
                router.push({
                    name: "report-download",
                    params: {
                        slug: t("router.report-download"),
                        chapters: Object.entries(filterForm.value).map(
                            ([key, value]) => {
                                if (Array.isArray(value)) {
                                    return `${key}:${JSON.stringify(value)}`;
                                }
                                return `${key}:${value}`;
                            }
                        ),
                    },
                });
            } else {
                router.push({
                    name: "report-download",
                    params: {
                        slug: t("router.report-download"),
                    },
                });
            }
            await getList(params);
        }

        watch(
            () => locale.value,
            async (val) => {
                // 監聽語系切換時重取報表下載資料
                await getList();
                await getManual();
            }
        );

        onMounted(async () => {
            // 判斷是否有搜尋條件
            if (route.params.chapters && route.params.chapters.length > 0) {
                const arr: string[] = route.params.chapters as string[];
                // 將搜尋條件 轉換成物件
                const parseRouterParams = arr.reduce((acc: any, item: any) => {
                    const [key, value] = item.split(":");
                    // 為了防止 json parse 失敗 因此加上 try catch 可以讓失敗後繼續執行
                    try {
                        // 判斷是陣列格式時 需 parse
                        if (Array.isArray(JSON.parse(value))) {
                            acc[key] = JSON.parse(value);
                        }
                    } catch (e) {
                        acc[key] = value;
                    }
                    return acc;
                }, {});
                filterForm.value = parseRouterParams;
                await onFilter(filterForm.value);
                return;
            }
            await getList();
            await getManual();
        });

        return () => (
            <section>
                <div class="relative py-[20px] xl:py-[30px] px-[20px] xl:px-[30px]">
                    <Breadcrumb />
                    <h3 class="text-[28px] font-semibold mb-5 sm:mb-7">
                        {t("router.report-download")}
                    </h3>
                    <div class="xl:max-w-[1200px] min">
                        <ReportSearch
                            onSearchFilter={onFilter}
                            searchFilter={filterForm.value}
                        />
                    </div>
                    <div class="mt-3 sm:mt-12 border border-gray-600 p-5 rounded-[4px] bg-white">
                        <div class="flex flex-col sm:flex-row gap-1 sm:gap-4 justify-end mb-5">
                            {downloadManualData.value.path !== undefined &&
                            Object.keys(downloadManualData.value.path).length >
                                0
                                ? Object.keys(
                                      downloadManualData.value.path
                                  ).map((key) => {
                                      if (
                                          downloadManualData.value.path[key] !==
                                          undefined
                                      ) {
                                          return (
                                              <a
                                                  key={key}
                                                  target="_blank"
                                                  href={
                                                      downloadManualData.value
                                                          .path[key]
                                                  }
                                                  class="flex gap-2 p-2 items-center text-[14px] cursor-pointer hover:text-black-700 transition-all duration-300"
                                              >
                                                  <IconDownload class="!w-4 !h-4" />
                                                  {
                                                      downloadManualData.value[
                                                          "name"
                                                      ]
                                                  }
                                                  (
                                                  {t(
                                                      "report-download.manual.manual_" +
                                                          key
                                                  )}
                                                  )
                                              </a>
                                          );
                                      }
                                      return null;
                                  })
                                : null}
                        </div>
                        <ReportDownloadTable
                            v-loading={loading.value}
                            tableHeadData={tableHeadData.value}
                            tableBodyData={tableBodyData.value}
                        />
                        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mt-6">
                            <div class="order-2 lg:order-1 text-[14px]">
                                {t("global.totalPages", {
                                    total: pagination.value.total,
                                })}
                                ，
                                {t("global.currentPage", {
                                    current: currentPage.value,
                                    total: pagination.value.total,
                                })}
                            </div>
                            <Pagination
                                class="order-1 lg:order-2 mb-4 lg:mb-0"
                                total={pagination.value.total}
                                pageSize={pagination.value.pageSize}
                                page={currentPage.value}
                                onHandlePageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </section>
        );
    },
});
