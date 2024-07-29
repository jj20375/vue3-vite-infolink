import type { PropType } from "vue";
import type { ReportDownloadDataInterface } from "../interface/reportDownloadInterface.d";
import { defineComponent, ref, toRefs } from "vue";
import { RouterLink } from "vue-router";
import { useScroll } from "@vueuse/core";
import { useWindowResize } from "@/hooks/windowResize";
import DownloadDialog from "./DownloadDialog.vue";

export default defineComponent({
    name: "ReportDownloadTable",
    props: {
        tableHeadData: {
            type: Array as PropType<string[]>,
            default() {
                return [];
            },
        },
        tableBodyData: {
            type: Array as PropType<ReportDownloadDataInterface[]>,
            default() {
                return [
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
                            name: "report-detail-slug-id",
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
                            name: "report-detail-slug-id",
                            params: { slug: "報告資訊", id: 2 },
                        },
                    },
                ];
            },
        },
    },
    setup(props, { emit }) {
        const { isLargePad } = useWindowResize();
        // 商品詳情 彈窗dom
        const downloadDialogRef = ref<any>(null);
        // 要下載的檔案id及類型
        const downloadData = ref<any>(null);

        // 開啟彈窗
        const openDialog = (fileType: string, id: number | string) => {
            downloadData.value = {
                fileType: fileType,
                id: id,
            };
            downloadDialogRef.value.openDialog();
        };

        // 表格是否出現陰影(滑到底陰影會消失)
        const scrollRef = ref(null);
        const { x: xPosition, arrivedState } = useScroll(scrollRef, {
            behavior: "smooth",
        });
        const { right: rightArrived, left: leftArrived } = toRefs(arrivedState);

        return () => (
            <div
                class={[
                    [
                        "relative",
                        leftArrived.value
                            ? ""
                            : "before:absolute before:h-full before:w-[30px] before:pointer-events-none before:top-0 before:left-0 before:shadow-[inset_12px_0px_8px_-8px_rgba(5,5,5,0.1)]",
                        rightArrived.value
                            ? ""
                            : "after:absolute after:h-full after:w-[30px] after:pointer-events-none after:top-0 after:right-0 after:shadow-[inset_-12px_0px_8px_-8px_rgba(5,5,5,0.1)]",
                    ],
                ]}
            >
                <div ref={scrollRef} class="relative m-auto overflow-x-auto">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                {props.tableHeadData.map((item, index) => (
                                    <th key={index}>{item}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {props.tableBodyData.map((item) => (
                                <tr class="hover:bg-yellow-50 transition-all duration-100">
                                    <td class="min-w-[90px]">
                                        {item.industry}
                                    </td>
                                    <td class="min-w-[110px]">
                                        {item.language}
                                    </td>
                                    <td class="min-w-[200px]">
                                        <RouterLink
                                            to={{
                                                name: item.path.name,
                                                params: item.path.params,
                                            }}
                                        >
                                            {item.name}
                                        </RouterLink>
                                    </td>
                                    <td class="min-w-[120px]">{item.period}</td>
                                    <td class="min-w-[145px]">
                                        <div class="flex gap-2">
                                            {isLargePad.value &&
                                            item.fileType.map &&
                                            item.fileType.map.length > 0
                                                ? item.fileType.map(
                                                      (fileType) => (
                                                          <div key={fileType}>
                                                              <div
                                                                  class="w-8 h-8 cursor-pointer"
                                                                  onClick={() =>
                                                                      openDialog(
                                                                          fileType,
                                                                          item.id
                                                                      )
                                                                  }
                                                              >
                                                                  <img
                                                                      class="w-full h-full"
                                                                      src={`/img/report/${fileType}.svg`}
                                                                  />
                                                              </div>
                                                          </div>
                                                      )
                                                  )
                                                : item.fileType.map &&
                                                  item.fileType.map.length > 0
                                                ? item.fileType.map(
                                                      (fileType) => (
                                                          <el-tooltip
                                                              key={fileType}
                                                              effect="dark"
                                                              content={`.${fileType}`}
                                                              placement="top"
                                                          >
                                                              <div
                                                                  class="w-8 h-8 cursor-pointer"
                                                                  onClick={() =>
                                                                      openDialog(
                                                                          fileType,
                                                                          item.id
                                                                      )
                                                                  }
                                                              >
                                                                  <img
                                                                      class="w-full h-full"
                                                                      src={`/img/report/${fileType}.svg`}
                                                                  />
                                                              </div>
                                                          </el-tooltip>
                                                      )
                                                  )
                                                : null}
                                        </div>
                                    </td>
                                    <td class="min-w-[140px]">
                                        {item.publishTime}
                                    </td>
                                    <td class="min-w-[100px]">
                                        {item.downloadCount}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {props.tableBodyData.length === 0 && (
                        <div class="w-full text-center py-8 px-4">查無資料</div>
                    )}
                </div>
                <DownloadDialog
                    ref={downloadDialogRef}
                    downloadData={downloadData.value}
                />
            </div>
        );
    },
});
