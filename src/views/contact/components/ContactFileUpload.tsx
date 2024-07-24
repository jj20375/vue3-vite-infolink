import { defineComponent, ref } from "vue";
import { ElMessage } from "element-plus";
import type { UploadProps, UploadFile } from "element-plus";
import { isImageType } from "@/services/utils";
import { UploadAPI } from "@/api/utilsAPI";
import IconGallery from "@/components/icons/IconGallery.vue";
import IconAdd from "@/components/icons/IconAdd.vue";
import IconDelete from "@/components/icons/IconDelete.vue";
import styles from "./UploadSection.module.scss";
import { useI18n } from "vue-i18n";

export default defineComponent({
    name: "ContactFileUpload",
    props: {
        // 顯示彈窗
        prop: {
            type: String,
            default: "",
        },
        scene: {
            type: String,
            default: "work-order",
        },
    },
    emits: ["tempPath"],
    setup(props, { emit }) {
        const { t } = useI18n();
        const tipActive = ref(true); // 提示訊息
        const fileList = ref<any>(null);
        const fileDataList = ref<any>([]);
        // 預覽彈窗圖
        const dialogImageUrl = ref("");
        // 顯示預覽彈窗
        const showDialog = ref(false);

        /**
         * 圖片變更
         * @param file
         * @param fcFileList
         */
        async function handleChange(file: any, fcFileList: any) {
            console.log("fcFileList =>", file, fcFileList);
            fileList.value = fcFileList;

            if (fileList.value.length > 0) {
                tipActive.value = false;
            }

            if (file.size > 10 * 1024 * 1024) {
                ElMessage({
                    type: "error",
                    message: t("contact.photo.invalidSize"),
                });
                fileList.value.pop();
                return;
            }
            // 判斷是否符合圖片類型
            if (!isImageType(file.raw.type)) {
                ElMessage({
                    type: "error",
                    message: t("contact.photo.invalidType"),
                });
                fileList.value.pop();
                return;
            }
            const formData = new FormData();
            formData.append("file", file.raw);
            formData.append("scene", props.scene);
            // try {
            // const { data, status } = await UploadAPI(formData);
            // console.log("UploadAPI api => ", data.value);
            // if (status === "success") {
            //     const file = (data.value as any).data;
            //     fileDataList.value.push(file.path);
            //     fileList.value[fileList.value.length - 1].url = file.preview_url;
            //     emit("tempPath", fileDataList.value, props.prop);
            // } else {
            //     ElMessage({
            //         type: "error",
            //         message: (error.value as any).data.message,
            //     });

            // }
            // } catch (err) {
            //     console.log("HomeSampleAPI => ", err);
            //     fileList.value.pop();
            // }
        }

        const handleRemove: any = (removeFile: any) => {
            console.log(removeFile, fileList.value);
            const index = fileList.value.findIndex(
                (item: { uid: number }) => item.uid === removeFile.uid
            );
            if (index !== -1) {
                fileList.value.splice(index, 1);
                fileDataList.value.splice(index, 1);
            }
            if (fileList.value.length === 0) {
                tipActive.value = true;
            }
            emit("tempPath", fileDataList.value, props.prop);
        };

        /**
         * 上傳圖片超過限制數量
         * @param files
         * @param fileList
         */
        function imageOverLimit(files: any, fileList: any) {
            ElMessage({
                type: "error",
                message: "超過上傳圖片上限",
            });
        }

        return () => (
            <div
                class={
                    " flex justify-center items-center w-full min-h-[250px] bg-gray-100 p-2"
                }
            >
                <el-upload
                    class={[
                        "card-inner flex flex-col w-full h-full min-h-[250px] justify-center items-center p-4 border-dashed border-[3px] border-black-100 hover:border-black-300 leading-6",
                        !tipActive ? "active" : "",
                    ]}
                    ref="upload"
                    list-type="picture-card"
                    onChange={handleChange}
                    auto-upload={false}
                    drag
                    multiple
                    action=""
                    limit={5}
                    accept=".jpg, .jpeg, .png"
                    onExceed={imageOverLimit}
                >
                    {{
                        default: () => <IconAdd class="!w-8 !h-8" />,
                        tip: () =>
                            tipActive.value && (
                                <>
                                    <IconGallery class="!w-12 !h-12" />
                                    <div class="mt-3">
                                        {t("contact.photo.direction")}
                                    </div>
                                    <div class="mt-1 text-black-600">
                                        {t("contact.photo.limit")}
                                    </div>
                                </>
                            ),
                        file: ({ file }: { file: any }) => (
                            <div>
                                <img
                                    class="el-upload-list__item-thumbnail"
                                    src={file.url}
                                    alt=""
                                />
                                <span class="el-upload-list__item-actions">
                                    <span
                                        class="el-upload-list__item-delete"
                                        onClick={() => handleRemove(file)}
                                    >
                                        <IconDelete class="!w-8 !h-8" />
                                    </span>
                                </span>
                            </div>
                        ),
                    }}
                </el-upload>
                <el-dialog v-model={showDialog.value}>
                    <img
                        w-full
                        src={dialogImageUrl.value}
                        alt="Preview Image"
                    />
                </el-dialog>
            </div>
        );
    },
});
