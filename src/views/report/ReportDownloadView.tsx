import { defineComponent } from "vue";
import Breadcrumb from "@/components/Breadcrumb";
import { useRoute } from "vue-router";
import IconReset from "../../components/icons/IconReset.vue";

export default defineComponent({
    name: "ReportDownloadView",
    components: { Breadcrumb },
    props: {},
    emits: [],
    setup(props, { emit }) {
        const route = useRoute();
        // 解析搜尋條件
        let parseRouterParams: { [key: string]: string } = {};
        // 判斷是否有搜尋條件
        if (route.params.chapters && route.params.chapters.length > 0) {
            const arr: string[] = route.params.chapters as string[];
            // 將搜尋條件 轉換成物件
            parseRouterParams = arr.reduce((acc: any, item: any) => {
                const [key, value] = item.split(":");
                acc[key] = value;
                return acc;
            }, {});
        }
        // 將搜尋條件字串話
        let stringifyRouterParams: string[] = Object.entries(parseRouterParams).map(([key, value]) => `${key}:${value}`);
        console.log(route.name + "=>", route.params, parseRouterParams, stringifyRouterParams);
        return () => (
            <section class="h-full container flex justify-center items-center">
                <Breadcrumb />
                <IconReset class="text-red-500 w-[50px] h-[50px]" />
                <div class="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
                    <h1>報告下載頁</h1>
                </div>
            </section>
        );
    },
});
