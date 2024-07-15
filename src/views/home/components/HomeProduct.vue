<template>
    <div class="border-gray-600 border bg-white p-4 xl:p-9 rounded-[4px]">
        <h3 class="text-[20px] sm:text-[24px] font-semibold tracking-wider">{{t("home.product")}}</h3>
        <div class="mt-3 mb-5 bg-yellow-900 w-full h-[3px]"></div>
        <div class="w-[calc(100vw-72px)] xl:w-full">
            <el-tabs v-model="activeTab" class="custom-tab">
                <el-tab-pane v-for="(data, dataIndex) in datas" :label="data.category" :name="dataIndex">
                    <el-collapse class="custom-collapse" v-model="activeCollapse" accordion>
                        <el-collapse-item v-for="product in data.products" :name="product.id" :key="product.id">
                            <template #title>
                                <div class="py-1">
                                    <div class="text-[16px] text-start font-medium block" v-if="product.text">{{ product.text }}</div>
                                </div>
                            </template>
                            <div class="edit-section" v-html="product.content"></div>
                        </el-collapse-item>
                    </el-collapse>
                    <div class="flex justify-start mt-6 xl:justify-center xl:mt-8">
                        <Pagination :total="100" :pageSize="10" :page="currentPage" @handlePageChange="handlePageChange(1)" />
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from "vue";
import Pagination from "@/components/Pagination.vue";
import {useI18n} from "vue-i18n";
const { t } = useI18n();

interface Props {
    datas: {
        id: number;
        date: string;
        category: string;
        text: string;
        content: string;
    }[];
}

const props = withDefaults(defineProps<Props>(), {
    datas: () => [
        {
            id: 1,
            date: "2021-10-01",
            category: "分類1",
            text: "標題1",
            content: "回答1",
        },
    ],
});

const route = useRoute();
const currentPage = ref(1);

// 預設不展開選單
const activeCollapse = ref(["0"]);

const activeTab = ref(0);

const handlePageChange = (val: any) => {};
</script>
