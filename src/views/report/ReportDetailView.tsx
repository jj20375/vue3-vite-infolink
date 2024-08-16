import { defineComponent, ref, nextTick, onMounted, watch } from "vue";
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
        const { t, locale } = useI18n();
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
            title: "",
            date: "",
            content: "",
            files: [],
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

        watch(
            () => locale.value,
            async (val) => {
                // 監聽語系切換時重取報告下載詳情資料
                getDetail(Number(route.params.id));
            }
        );

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
                            {isEmpty(reportData.value.title) ? (
                                <el-skeleton rows={1} />
                            ) : (
                                reportData.value.title
                            )}
                        </h3>
                        <div class="h-[3px] w-full bg-yellow-900 my-4"></div>
                        {isEmpty(reportData.value.content) ? (
                            <el-skeleton rows={5} />
                        ) : (
                            <div
                                class="edit-section"
                                v-html={reportData.value.content}
                            ></div>
                        )}
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
