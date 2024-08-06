import { defineComponent, ref, nextTick, onMounted } from "vue";
import { useWindowResize } from "@/hooks/windowResize";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import Breadcrumb from "@/components/Breadcrumb";
import ReportDownloadDialog from "./components/ReportDownloadDialog.vue";
import IconArrowLeft from "@/components/icons/IconArrowLeft.vue";
import { GetReportDetailAPI } from "@/api/reportAPI";
import type { ReportDetailResponseAPIInterface } from "./interface/reportDownloadInterface";
import { isEmpty } from "@/services/utils";

export default defineComponent({
    name: "ReportDetailView",
    props: {},
    emits: [],
    setup(props, { emit }) {
        const { t } = useI18n();
        const route = useRoute();
        const router = useRouter();
        const { isLargePad } = useWindowResize();

        // 商品詳情 彈窗dom
        const downloadDialogRef = ref<any>(null);

        // 要下載的檔案id及類型
        const downloadData = ref<any>(null);

        // 開啟彈窗
        const openDialog = (fileType: string, id: number) => {
            downloadData.value = {
                fileType: fileType,
                id: id,
            };
            nextTick(() => {
                downloadDialogRef.value.openDialog();
            });
        };

        const reportData = ref({
            title: "產業鏈價格預測月報告",
            date: "2024-02-11",
            content:
                "<p>全球鋰電池供應鏈數據庫報告涵蓋全球鋰電池市場供需情形，提供電芯環節的細部數據，包括各企業的產能、產量、出貨等，且拆分各市場應用別如大型與工商業儲能、戶用儲能。除了詳細數據資料，全球鋰電池供應鏈數據庫也提供全產業鏈上的綜觀與趨勢分析，協助企業作為策略佈局的重要依據。<br><br>全球鋰電池供應鏈數據庫内容包含：<br><br>1. 全球鋰電池市場概況<br>2. 鋰電池市場供需分析<br>3. 上游材料鋰礦分析<br>4. 鋰電池價格預測<br>5. 鋰電池主要企業產能、產量、出貨分析</p>",
            files: ["pdf", "xlsx", "xlsm"],
        });

        async function getDetail(id: number) {
            try {
                const { data }: ReportDetailResponseAPIInterface =
                    await GetReportDetailAPI({ id });
                let fileTypes: any = [];
                if (!isEmpty(data.data.files)) {
                    fileTypes = Object.keys(data.data.files).map((fileType) => {
                        return fileType;
                    });
                }
                reportData.value = {
                    title: data.data.name,
                    date: data.data.published_at,
                    content: data.data.content,
                    files: fileTypes,
                };
            } catch (err) {
                console.log("GetReportDetailAPI err =>", err);
            }
        }

        onMounted(async () => {
            await getDetail(Number(route.params.id));
        });
        return () => (
            <>
                <div class="relative p-[20px] sm:p-[30px] pb-[60px]">
                    <Breadcrumb />
                    <div
                        class="flex items-center mt-4 sm:mt-[30px] gap-2 text-[14px] hover:text-black-600 cursor-pointer duration-300 transition-all"
                        onClick={() => router.go(-1)}
                    >
                        <IconArrowLeft />
                        {t("global.back-list")}
                    </div>
                    <div class="max-w-[800px] p-[20px] sm:p-[48px] mx-auto bg-white border border-black-100 rounded-[4px] mt-5">
                        <div class="text-black-800 text-[14px] mb-1">
                            {reportData.value.date}
                        </div>
                        <h3 class="text-black-800 font-semibold text-[20px] sm:text-[28px]">
                            {reportData.value.title}
                        </h3>
                        <div class="h-[3px] w-full bg-yellow-900 my-4"></div>
                        <div
                            class="edit-section"
                            v-html={reportData.value.content}
                        ></div>
                        <div class="h-[1px] w-full bg-black-100 my-4"></div>
                        <div class="mt-6 mb-4 font-medium">
                            {t("report-detail.title")}
                        </div>
                        <div class="flex gap-2">
                            {!isLargePad.value
                                ? reportData.value.files.map(
                                      (fileType: string) => (
                                          <el-tooltip
                                              key={fileType}
                                              effect="dark"
                                              content={`.${fileType}`}
                                              placement="top"
                                          >
                                              <div
                                                  class="w-12 h-12 cursor-pointer"
                                                  onClick={() =>
                                                      openDialog(
                                                          fileType,
                                                          Number(
                                                              route.params.id
                                                          )
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
                                : reportData.value.files.map(
                                      (fileType: string) => (
                                          <div
                                              class="w-12 h-12 cursor-pointer"
                                              onClick={() =>
                                                  openDialog(
                                                      fileType,
                                                      Number(route.params.id)
                                                  )
                                              }
                                          >
                                              <img
                                                  class="w-full h-full"
                                                  src={`/img/report/${fileType}.svg`}
                                              />
                                          </div>
                                      )
                                  )}
                        </div>
                    </div>
                </div>
                <ReportDownloadDialog
                    ref={downloadDialogRef}
                    downloadData={downloadData.value}
                />
            </>
        );
    },
});
