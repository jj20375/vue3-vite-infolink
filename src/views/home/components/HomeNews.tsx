import { defineComponent, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { PostInterface } from "../interface/postInterface";
import { GetPostListAPI } from "@/api/postAPI";
import { isEmpty } from "@/services/utils";
import Pagination from "@/components/Pagination.vue";
import dayjs from "dayjs";
export default defineComponent({
    name: "HomeNews",
    setup(props, { emit }) {
        const { t, locale } = useI18n();
        const loading = ref(false);
        // 文章列表資料
        const datas = ref<PostInterface[]>([]);
        const currentPage = ref(1);
        const pagination = ref({
            pageSize: 10,
            total: 1,
        });

        const activeNames = ref(["0"]);
        /**
         * 取得資料
         * @param params
         */
        async function getList(params?: { page: number }) {
            loading.value = true;
            try {
                const { data } = await GetPostListAPI(params);
                datas.value = data.data.rows.map((item) => {
                    return {
                        id: item.id,
                        title: item.title,
                        content: item.content,
                        articleCategory: item.articleCategory,
                        publishedAt: item.published_at,
                    };
                });
                pagination.value = {
                    pageSize: data.data.meta.limit,
                    total: data.data.meta.total,
                };
                currentPage.value = data.data.meta.current_page;
                activeNames.value = isEmpty(data.data.rows)
                    ? ["0"]
                    : [String(data.data.rows[0].id)];
            } catch (err) {
                console.log("GetPostListAPI err =>", err);
            } finally {
                loading.value = false;
            }
        }

        async function handlePageChange(val: number) {
            currentPage.value = val;
            await getList({ page: val });
        }

        const slots = {
            title: (data: PostInterface) => (
                <div>
                    <div class="flex items-center gap-4 leading-8">
                        <div class="text-[13px]">
                            {dayjs(data.publishedAt).format("YYYY-MM-DD")}
                        </div>
                        <div class="relative bg-black-300 w-[1px] h-4"></div>
                        <div>
                            <span class="px-2 py-1 text-[13px] bg-yellow-200 rounded-sm">
                                {data.articleCategory.name}
                            </span>
                        </div>
                    </div>
                    <div class="text-[16px] text-start font-medium block leading-7 lg:leading-8">
                        {data.title}
                    </div>
                </div>
            ),
            default: (data: PostInterface) => (
                <div class="edit-section" v-html={data.content}></div>
            ),
        };

        watch(
            () => locale.value,
            async (val: string) => {
                // 監聽語系切換時重取最新公告下載資料
                await getList({ page: currentPage.value });
            }
        );

        onMounted(async () => {
            await getList({ page: 1 });
        });

        return () => (
            <div class="border-gray-600 border bg-white p-[16px] sm:p-[36px] rounded-[4px]">
                <h3 class="text-[20px] sm:text-[24px] font-semibold tracking-wider">
                    {t("home.news-title")}
                </h3>
                <div class="mt-3 xl:mb-2 bg-yellow-900 w-full h-[3px]"></div>
                <el-collapse
                    v-loading={loading.value}
                    class="custom-collapse"
                    v-model={activeNames.value}
                    accordion
                >
                    {!isEmpty(datas.value)
                        ? datas.value.map((data) => (
                              <el-collapse-item name={data.id} key={data.id}>
                                  {{
                                      title: () => slots.title(data),
                                      default: () => slots.default(data),
                                  }}
                              </el-collapse-item>
                          ))
                        : null}
                </el-collapse>
                <div class="flex justify-start mt-6 xl:justify-center xl:mt-8">
                    <Pagination
                        total={pagination.value.total}
                        pageSize={pagination.value.pageSize}
                        page={currentPage.value}
                        onHandlePageChange={handlePageChange}
                    />
                </div>
            </div>
        );
    },
});
