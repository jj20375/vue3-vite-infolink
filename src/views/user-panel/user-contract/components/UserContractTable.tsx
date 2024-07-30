import { defineComponent, toRefs, ref, watch } from "vue";
import type { PropType } from "vue";
import type { UserContractDataInterface } from "../interface/userContractInterface.d";
import { useSort } from "@/hooks/useSort";
import { useScroll } from "@vueuse/core";
export default defineComponent({
    name: "UserContractTable",
    props: {
        tableHead: {
            type: Array as PropType<{ sortKey?: string; label: string }[]>,
            default() {
                return [{ sortKey: "", label: "" }];
            },
        },
        tableBodyData: {
            type: Array as PropType<UserContractDataInterface[]>,
            default() {
                return [];
            },
        },
        searchFilter: {
            type: Object as PropType<{
                // 報告名稱(分類)
                category?: string[];
                // 搜尋名稱
                name?: string;
            }>,
            default() {
                return {};
            },
        },
        parentSortAscend: {
            type: String as PropType<string | null>,
            default: null,
        },
        parentSortField: {
            type: String as PropType<string | null>,
            default: null,
        },
    },
    emits: ["sortBy"],
    setup(props, { emit }) {
        const { getSortIconName, setSort, sortField, sortAscend } = useSort();
        // 表格是否出現陰影(滑到底陰影會消失
        const scrollRef = ref(null);
        const { x: xPosition, arrivedState } = useScroll(scrollRef, {
            behavior: "smooth",
        });
        const { right: rightArrived, left: leftArrived } = toRefs(arrivedState);

        /**
         * 取得排序資料
         *
         *
         * @param {string} field 欄位名稱
         *
         * @returns {void}
         */
        const filterSearch = async (field: string) => {
            setSort(field);
            await emit("sortBy", {
                ...props.searchFilter,
                sortBy: sortField.value,
                sortRule: sortAscend.value ? "asc" : "desc",
            });
        };

        watch(
            () => props.parentSortAscend,
            (val) => {
                sortAscend.value = val === "asc" ? true : false;
            }
        );
        watch(
            () => props.parentSortField,
            (val) => {
                sortField.value = val;
            }
        );

        return () => (
            <div
                class={[
                    "relative",
                    leftArrived.value
                        ? ""
                        : "before:absolute before:h-full before:w-[30px] before:pointer-events-none before:top-0 before:left-0 before:shadow-[inset_12px_0px_8px_-8px_rgba(5,5,5,0.1)]",
                    rightArrived.value
                        ? ""
                        : "after:absolute after:h-full after:w-[30px] after:pointer-events-none after:top-0 after:right-0 after:shadow-[inset_-12px_0px_8px_-8px_rgba(5,5,5,0.1)]",
                ]}
            >
                <div ref={scrollRef} class="relative m-auto overflow-x-auto">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                {props.tableHead.map((item, index) => {
                                    if (item.sortKey) {
                                        return (
                                            <th
                                                key={index}
                                                class="cursor-pointer"
                                                onClick={() =>
                                                    filterSearch(item.sortKey!)
                                                }
                                            >
                                                <div class="flex items-center">
                                                    <span class="shrink-0">
                                                        {item.label}
                                                    </span>
                                                    <div class="w-6 h-6 shrink-0">
                                                        <img
                                                            class="w-full h-full"
                                                            src={`/img/auth/${getSortIconName(
                                                                item.sortKey
                                                            )}.svg`}
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                        );
                                    } else {
                                        return (
                                            <th key={index}>{item.label}</th>
                                        );
                                    }
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {props.tableBodyData.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td class="min-w-[140px]">
                                            {item.contractIssuedDate}
                                        </td>
                                        <td class="min-w-[140px]">
                                            {item.contractEffectiveDate}
                                        </td>
                                        <td class="min-w-[140px]">
                                            {item.contractExpiryDate}
                                        </td>
                                        <td class="min-w-[220px] edit-section">
                                            <ul>
                                                {item.purchasedReport.map(
                                                    (reportName) => (
                                                        <li>{reportName}</li>
                                                    )
                                                )}
                                            </ul>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {props.tableBodyData.length === 0 && (
                        <div class="w-full text-center py-8 px-4">查無資料</div>
                    )}
                </div>
            </div>
        );
    },
});
