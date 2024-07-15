<template>
    <div class="border-gray-600 border bg-white p-[16px] sm:p-[36px] rounded-[4px]">
        <h3 class="text-[20px] sm:text-[24px] font-semibold tracking-wider">{{ $t("home.news-title") }}</h3>
        <div class="mt-3 xl:mb-2 bg-yellow-900 w-full h-[3px]"></div>
        <el-collapse class="custom-collapse" v-model="activeNames" accordion>
            <el-collapse-item v-for="data in datas" :name="data.id" :key="data.id">
                <template #title>
                    <div>
                        <div class="flex items-center gap-4 leading-8">
                            <div class="text-[13px]">{{ data.date }}</div>
                            <div class="relative bg-black-300 w-[1px] h-4"></div>
                            <div>
                                <span class="px-2 py-1 text-[13px] bg-yellow-200 rounded-sm">{{ data.category }}</span>
                            </div>
                        </div>
                        <div class="text-[16px] text-start font-medium block leading-7 lg:leading-8">{{ data.text }}</div>
                    </div>
                </template>
                <div class="edit-section" v-html="data.content"></div>
            </el-collapse-item>
        </el-collapse>
        <div class="flex justify-start mt-6 xl:justify-center xl:mt-8">
            <Pagination :total="100" :pageSize="10" :page="currentPage" @handlePageChange="handlePageChange(1)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from "vue";
import Pagination from "@/components/Pagination.vue";

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
const activeNames = ref(["0"]);

const handlePageChange = (val: any) => {};
</script>
