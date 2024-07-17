import {defineComponent, ref, watch, markRaw, computed} from "vue";
import type { PropType } from "vue";
import type { UserContractDataInterface } from "../interface/userContractInterface.d";
import type { OptionsInterface, ColumnsInterface } from "@/interface/global.d";
import { useWindowResize } from "@/hooks/windowResize";
import IconSearch from "@/components/icons/IconSearch.vue";
import Pagination from "@/components/Pagination.vue";
import Breadcrumb from "@/components/Breadcrumb";
import UserContractTable from "./components/UserContractTable";
import {useI18n} from "vue-i18n";

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
    emits: ["update:searchFilter"],
    setup(props, { emit }) {
        const {t} = useI18n();
        // 歷年合約紀錄表單欄位 key
        type UserContractSearchFormPropType = "category" | "name";

        const { isLargePad } = useWindowResize();
        const filterForm = ref<FilterInterFace | any>(props.searchFilter);

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

        const filterColumns = computed<ColumnsInterface<UserContractSearchFormPropType>[]>(() => [
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
        const checkAll = ref(filterColumns.value.filter((item: any) => item).map(() => false));

        const handleCheckAll = (item: any, index: string | number) => {
            if (checkAll.value[index]) {
                filterForm.value[item.prop] = item.options.map((option: any) => option.value);
            } else {
                filterForm.value[item.prop] = [];
            }
        };

        // 多選選單選項改變時，判斷是否全選
        const handleOptionChange = (item: any, index: string | number) => {
            if (filterForm.value[item.prop].length !== item.options.length && filterForm.value[item.prop].length !== 0) {
                checkAll.value[index] = false;
            } else if (filterForm.value[item.prop].length === item.options.length) {
                checkAll.value[index] = true;
            }
        };

        watch(filterForm.value, (val) => {
            emit("update:searchFilter", val);
        });

        function onSubmit(val: FilterInterFace) {
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
                                            {t("global.all")}
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
        const {t} = useI18n();
        const filterForm = ref<any>(defaultFilter);
        // 排序 key
        const sortField = ref(null);
        // 排序方式 倒序 或者 正序
        const sortAscend = ref(null);

        // 表單標題
        const tableHeadData = computed(() => [
            {
                sortKey: "contractIssuedDate",
                label: t("user-contract.table.contractIssuedDate"),
            },
            {
                sortKey: "contractEffectiveDate",
                label: t("user-contract.table.contractEffectiveDate"),
            },
            {
                sortKey: "contractExpiryDate",
                label: t("user-contract.table.contractExpiryDate"),
            },
            {
                label: t("user-contract.table.contractItem"),
            },
        ]);

        // 表單資料
        const tableBodyData = ref<UserContractDataInterface[]>([
            {
                id: 0,
                contractIssuedDate: "2024-01-29",
                contractEffectiveDate: "2024-02-01",
                contractExpiryDate: "2025-01-31",
                purchasedReport: "<ul><li>全球離電池供應鏈數據庫 (簡中/繁中/英文)</li><li>供應鏈成本調研 (繁中/英文)</li><li>產業鏈價格預測月報告 (簡中)</li></ul>",
            },
        ]);

        const currentPage = ref(1);

        /**
         * 取得報告列表
         *
         *
         * @returns {void}
         */

        const getContractList = () => {
            console.log("getContractList", sortField.value, sortAscend.value);
        };

        function handlePageChange(val: any) {
            return val;
        }

        return () => (
            <section>
                <div class="relative py-[20px] xl:py-[30px] px-[20px] xl:px-[30px]">
                    <Breadcrumb />
                    <h3 class="text-[28px] font-semibold mb-5 sm:mb-7">{t('router.user-contract')}</h3>
                    <div class="custom-form xl:max-w-[1200px]">
                        <ContractSearch searchFilter={filterForm.value} />
                    </div>
                    <div class="mt-3 sm:mt-12 border border-gray-600 p-5 rounded-[4px] bg-white">
                        <UserContractTable tableHead={tableHeadData.value} tableBodyData={tableBodyData.value} />
                        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center mt-6">
                            <div class="order-2 lg:order-1 text-[14px]">共有 32 筆資料，第 1 / 10 頁</div>
                            <Pagination class="order-1 lg:order-2 mb-4 lg:mb-0" total={100} pageSize={10} page={currentPage.value} onHandlePageChange={handlePageChange(1)} />
                        </div>
                    </div>
                </div>
            </section>
        );
    },
});
