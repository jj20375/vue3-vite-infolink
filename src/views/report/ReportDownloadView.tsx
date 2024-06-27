export default {
    name: "ReportDownloadView",
    props: {},
    emits: [],
    setup(props: any, { emit }: { emit: string }) {
        return () => (
            <section class="h-full container flex justify-center items-center">
                <div class="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
                    <h1>報告下載頁</h1>
                </div>
            </section>
        );
    },
};
