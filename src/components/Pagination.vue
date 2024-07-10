<template>
    <div id="myPagination">
        <el-pagination v-model:current-page="currnetPage" :page-size="pageSize" :pager-count="5" layout="prev, pager, next" :background="true" :total="total" @update:current-page="handlePageChange" />
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
interface Props {
    page: number;
    total: number;
    pageSize: number;
}
const props = withDefaults(defineProps<Props>(), {
    page: 1,
    pageSize: 10,
    total: 0,
});

const currnetPage = ref(props.page);
const emit = defineEmits(["handlePageChange"]);

const handlePageChange = (value: any) => {
    emit("handlePageChange", value);
};
</script>

<style lang="scss" scoped>
:deep(.el-pager li) {
    @apply bg-transparent min-w-[16px] w-7 h-7 font-medium text-black-400 text-[14px] xl:text-[15px] rounded-[4px] mx-1 hover:text-black-800 hover:bg-yellow-900 transition-all duration-300 #{!important};
    &.is-active {
        @apply text-black-900 font-medium border-none rounded-[4px] bg-yellow-900 #{!important};
    }
}
:deep(.el-pagination.is-background .btn-prev) {
    @apply bg-transparent #{!important};
    .el-icon {
        @apply w-[14px] h-[14px] bg-cover;
        background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxtYXNrIGlkPSJtYXNrMF80ODlfMjM0NyIgc3R5bGU9Im1hc2stdHlwZTphbHBoYSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij4NCjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgZmlsbD0iI0Q5RDlEOSIvPg0KPC9tYXNrPg0KPGcgbWFzaz0idXJsKCNtYXNrMF80ODlfMjM0NykiPg0KPHBhdGggZD0iTTE2LjAwMDQgMjEuNjUzOEw2LjM0NjY4IDEyTDE2LjAwMDQgMi4zNDYyNUwxNy40MTk3IDMuNzY1NUw5LjE4NDkzIDEyTDE3LjQxOTcgMjAuMjM0NUwxNi4wMDA0IDIxLjY1MzhaIiBmaWxsPSIjMzMzMzMzIi8+DQo8L2c+DQo8L3N2Zz4=");
        svg {
            @apply hidden;
        }
        &[disabled] {
            @apply opacity-0;
        }
    }
}
:deep(.el-pagination.is-background .btn-next) {
    @apply bg-transparent #{!important};
    .el-icon {
        @apply w-[14px] h-[14px] bg-cover;
        background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCAyMCAyMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxtYXNrIGlkPSJtYXNrMF8yNzA5XzU0NDciIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMSI+DQo8cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgMjAuNSkiIGZpbGw9IiNEOUQ5RDkiLz4NCjwvbWFzaz4NCjxnIG1hc2s9InVybCgjbWFzazBfMjcwOV81NDQ3KSI+DQo8cGF0aCBkPSJNNi42MzgzMSAyLjQ1NTA5TDE0LjY4MzEgMTAuNDk5OUw2LjYzODMxIDE4LjU0NDdMNS40NTU2IDE3LjM2MkwxMi4zMTc5IDEwLjQ5OTlMNS40NTU2IDMuNjM3OEw2LjYzODMxIDIuNDU1MDlaIiBmaWxsPSIjMzMzMzMzIi8+DQo8L2c+DQo8L3N2Zz4=");
        svg {
            @apply hidden;
        }
        &[disabled] {
            @apply opacity-0;
        }
    }
}
</style>
