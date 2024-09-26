import { defineComponent, ref, watch, markRaw, computed, onMounted } from "vue";
import type { PropType } from "vue";
import type { UserContractDataInterface } from "./interface/userContractInterface.d";
import type { OptionsInterface, ColumnsInterface } from "@/interface/global.d";
import { useWindowResize } from "@/hooks/windowResize";
import IconSearch from "@/components/icons/IconSearch.vue";
import Pagination from "@/components/Pagination.vue";
import Breadcrumb from "@/components/Breadcrumb";
import UserContractTable from "./components/UserContractTable";
import { useI18n } from "vue-i18n";
import { GetContractListAPI } from "@/api/contractAPI";
import type {
    UserContractListResponseAPIInterface,
    UserContractParamsInterface,
} from "../user-info/interface/userInterface";
import { isEmpty } from "@/services/utils";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { useRoute, useRouter } from "vue-router";
import type { ReportDownloadCategoriesAPIInterface } from "@/views/report/interface/reportDownloadInterface";
import { GetContractCategoriesAPI } from "@/api/contractAPI";

interface FilterInterFace {
    // 報告名稱(分類)
    category?: string[];
    // 搜尋名稱
    name?: string;
}

// 預設搜尋條件值
const defaultFilter = { category: [], name: "" };

const ContractSearch = defineComponent({
    name: "UserContractSearch",
    props: {
        searchFilter: {
            type: Object as PropType<FilterInterFace>,
            default: () => defaultFilter,
        },
    },
    emits: ["searchFilter"],
    setup(props, { emit }) {
        const { t } = useI18n();
        // 歷年合約紀錄表單欄位 key
        type UserContractSearchFormPropType = "category" | "name";

        const { isLargePad } = useWindowResize();
        const filterForm = ref<FilterInterFace | any>(props.searchFilter);

        const categoryOptions = ref<OptionsInterface[]>([]);

        const filterColumns = computed<
            ColumnsInterface<UserContractSearchFormPropType>[]
        >(() => [
            {
                prop: "category",
                label: t("user-contract.category.label"),
                placeholder: t("user-contract.category.placeholder"),
                style: "muti-select",
                options: categoryOptions.value,
            },
            {
                prop: "name",
                label: t("user-contract.name.label"),
                placeholder: t("user-contract.name.placeholder"),
                style: "input",
                iconName: markRaw(IconSearch),
            },
        ]);

        // 多選選單新增全部按鈕
        const checkAll = ref(
            filterColumns.value.filter((item: any) => item).map(() => false)
        );

        const handleCheckAll = (item: any, index: any) => {
            if (checkAll.value[index]) {
                filterForm.value[item.prop] = item.options.map(
                    (option: any) => option.value
                );
            } else {
                filterForm.value[item.prop] = [];
            }
            emit("searchFilter", {
                ...filterForm.value,
                page: 1,
                resetSort: true,
            });
        };

        // 多選選單選項改變時，判斷是否全選
        const handleOptionChange = (item: any, index: any) => {
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
            emit("searchFilter", {
                ...filterForm.value,
                page: 1,
                resetSort: true,
            });
        };

        /**
         * 取得報告名稱下拉資料
         */
        async function getReportCategories() {
            try {
                const { data }: ReportDownloadCategoriesAPIInterface =
                    await GetContractCategoriesAPI();

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

        function onSubmit(val: FilterInterFace) {
            emit("searchFilter", { ...val, page: 1, resetSort: true });
        }

        onMounted(async () => {
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
                                start-placeholder="開始日期"
                                end-placeholder="結束日期"
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
                </div>
            </div>
        );
    },
});

export default defineComponent({
    name: "UserContract",
    props: {},
    emits: [],
    setup(props, { emit }) {
        const { t, locale } = useI18n();
        const route: RouteLocationNormalizedLoaded = useRoute();
        const router = useRouter();
        const filterForm = ref<any>(defaultFilter);
        // 排序 key
        const sortField = ref<string | null>(null);
        // 排序方式 倒序 或者 正序
        const sortAscend = ref<string | null>(null);

        // 表單標題
        const tableHeadData = computed(() => [
            {
                sortKey: "created_at",
                label: t("user-contract.table.contractIssuedDate"),
            },
            {
                sortKey: "enabled_at",
                label: t("user-contract.table.contractEffectiveDate"),
            },
            {
                sortKey: "expired_at",
                label: t("user-contract.table.contractExpiryDate"),
            },
            {
                label: t("user-contract.table.contractItem"),
            },
        ]);

        // 表單資料
        const tableBodyData = ref<UserContractDataInterface[]>([
            {
                // 合約開立日
                contractIssuedDate: "2024-01-29",
                // 合約生效日
                contractEffectiveDate: "2024-02-01",
                // 合約到期日
                contractExpiryDate: "2025-01-31",
                purchasedReport: [],
            },
        ]);

        const currentPage = ref(1);
        const pagination = ref({
            pageSize: 10,
            total: 1,
        });

        async function handlePageChange(val: number) {
            currentPage.value = val;

            await onFilter({ ...filterForm.value, page: currentPage.value });
        }

        async function getList(params?: UserContractParamsInterface | void) {
            try {
                const { data }: UserContractListResponseAPIInterface =
                    await GetContractListAPI(params);
                tableBodyData.value = data.data.rows.map((row) => {
                    return {
                        // 合約開立日
                        contractIssuedDate: row.created_at,
                        // 合約生效日
                        contractEffectiveDate: row.enabled_at,
                        // 合約到期日
                        contractExpiryDate: row.expired_at,
                        // 購買報告項目
                        purchasedReport: row.contractReportNames,
                    };
                });
            } catch (err) {
                console.log("GetContractListAPI err =>", err);
            }
        }

        /**
         * 搜尋條件取得列表資料
         * @param val
         */
        async function onFilter(
            val: FilterInterFace & {
                page?: number;
                sortBy?: string | null;
                sortRule?: "desc" | "asc" | null;
                resetSort?: boolean;
            }
        ) {
            if (!isEmpty(val.page)) {
                currentPage.value = val.page!;
            }
            // 判斷有點擊搜尋按鈕時 清空排序規則
            if (val.resetSort) {
                sortField.value = null;
                sortAscend.value = null;
            }
            // 判斷有傳送排序 key 時 給予排序值
            if (!isEmpty(val.sortBy)) {
                sortField.value = val.sortBy!;
            }
            // 判斷有傳送規格 時 給予排序規則
            if (!isEmpty(val.sortRule)) {
                sortAscend.value = val.sortRule!;
            }
            filterForm.value = val;
            const params: UserContractParamsInterface | any = {
                keyword: val.name,

                report_category_id: Array.isArray(val.category)
                    ? val.category
                    : [],
                order_column: val.sortBy,
                order_direction: val.sortRule,
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
                    name: "user-contract",
                    params: {
                        level2Slug: t("router.user-contract"),
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
                    name: "user-contract",
                    params: {
                        slug: t("router.user-contract"),
                    },
                });
            }
            await getList(params);
        }

        /**
         * 初始化
         * @returns
         */
        async function init() {
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
        }

        watch(
            () => locale.value,
            async (val) => {
                // 監聽語系切換時重取歷年合約紀錄資料
                await init();
            }
        );

        onMounted(async () => {
            await init();
        });

        return () => (
            <section>
                <div class="relative py-[20px] xl:py-[30px] px-[20px] xl:px-[30px]">
                    <Breadcrumb />
                    <h3 class="text-[28px] font-semibold mb-5 sm:mb-7">
                        {t("router.user-contract")}
                    </h3>
                    <div class="custom-form xl:max-w-[1200px]">
                        <ContractSearch
                            onSearchFilter={onFilter}
                            searchFilter={filterForm.value}
                        />
                    </div>
                    <div class="mt-3 sm:mt-12 border border-gray-600 p-5 rounded-[4px] bg-white">
                        <UserContractTable
                            tableHead={tableHeadData.value}
                            tableBodyData={tableBodyData.value}
                            onSortBy={onFilter}
                            searchFilter={filterForm.value}
                            parentSortField={sortField.value}
                            parentSortAscend={sortAscend.value}
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
