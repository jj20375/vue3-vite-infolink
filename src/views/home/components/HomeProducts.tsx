import { defineComponent, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import Pagination from "@/components/Pagination.vue";
import type {
    ProductCategoryInterface,
    ProductInterface,
    ProductListParamsAPIInterface,
} from "../interface/productInterface";
import { GetProductCategoriesAPI, GetProductListAPI } from "@/api/productAPI";
import { isEmpty } from "@/services/utils";

interface FilterInterFace {
    category_id?: number;
}

export default defineComponent({
    name: "HomeProducts",
    setup(props, { emit }) {
        const { t } = useI18n();
        const loading = ref(false);
        // 分類列表資料
        const categories = ref<ProductCategoryInterface[]>();
        // 產品列表資料
        const datas = ref<ProductInterface[]>([]);

        const currentPage = ref(1);
        const pagination = ref({
            pageSize: 10,
            total: 1,
        });
        // 預設不展開選單
        const activeCollapse = ref(["0"]);

        // 選擇分類 tab
        const activeCategoryTab = ref(0);

        async function handlePageChange(val: number) {
            currentPage.value = val;
            await onFilter({ category_id: activeCategoryTab.value, page: val });
        }

        /**
         * 取得分類列表資料
         */
        async function getCategories() {
            try {
                const { data } = await GetProductCategoriesAPI();
                categories.value = data.data;
                activeCategoryTab.value = data.data[0].id;
            } catch (err) {
                console.log("GetProductCategoriesAPI err =>", err);
            }
        }

        /**
         * 取得資料
         * @param params
         */
        async function getList(params?: ProductListParamsAPIInterface) {
            loading.value = true;
            try {
                const { data } = await GetProductListAPI(params);
                datas.value = data.data.rows.map((item) => {
                    return {
                        id: item.id,
                        title: item.name,
                        content: item.content,
                        productCategory: item.productCategory,
                    };
                });
                pagination.value = {
                    pageSize: data.data.meta.limit,
                    total: data.data.meta.total,
                };
                currentPage.value = data.data.meta.current_page;
                activeCollapse.value = isEmpty(data.data)
                    ? ["0"]
                    : [String(data.data.rows[0].id)];
            } catch (err) {
                console.log("GetProductListAPI err =>", err);
            } finally {
                loading.value = false;
            }
        }

        async function onFilter(val: FilterInterFace & { page: number }) {
            currentPage.value = val.page;
            await getList({ ...val, page: val.page });
        }

        const slots = {
            title: (data: ProductInterface) => (
                <div class="py-1">
                    <div class="text-[16px] text-start font-medium block">
                        {data.title}
                    </div>
                </div>
            ),
            default: (data: ProductInterface) => (
                <div class="edit-section" v-html={data.content}></div>
            ),
        };

        onMounted(async () => {
            await getCategories();
            await getList();
        });

        return () => (
            <div class="border-gray-600 border bg-white p-4 xl:p-9 rounded-[4px]">
                <h3 class="text-[20px] sm:text-[24px] font-semibold tracking-wider">
                    {t("home.product-title")}
                </h3>
                <div class="mt-3 mb-5 bg-yellow-900 w-full h-[3px]"></div>
                <div
                    class="w-[calc(100vw-72px)] xl:w-full"
                    v-loading={loading.value}
                >
                    <el-tabs
                        v-model={activeCategoryTab.value}
                        class="custom-tab"
                    >
                        {!isEmpty(categories.value)
                            ? categories.value?.map((category) => (
                                  <el-tab-pane
                                      key={category.id + "category"}
                                      label={category.name}
                                      name={category.id}
                                  >
                                      <el-collapse
                                          class="custom-collapse"
                                          v-model={activeCollapse.value}
                                          accordion
                                      >
                                          {!isEmpty(datas.value) ? (
                                              datas.value.map((data) => (
                                                  <el-collapse-item
                                                      name={String(
                                                          data.productCategory
                                                              .id
                                                      )}
                                                      key={data.id + "content"}
                                                  >
                                                      {{
                                                          title: () =>
                                                              slots.title(data),
                                                          default: () =>
                                                              slots.default(
                                                                  data
                                                              ),
                                                      }}
                                                  </el-collapse-item>
                                              ))
                                          ) : (
                                              <div>
                                                  {t("global.empty-data")}
                                              </div>
                                          )}
                                      </el-collapse>
                                      <div class="flex justify-start mt-6 xl:justify-center xl:mt-8">
                                          <Pagination
                                              total={pagination.value.total}
                                              pageSize={
                                                  pagination.value.pageSize
                                              }
                                              page={currentPage.value}
                                              onHandlePageChange={
                                                  handlePageChange
                                              }
                                          />
                                      </div>
                                  </el-tab-pane>
                              ))
                            : null}
                    </el-tabs>
                </div>
            </div>
        );
    },
});
