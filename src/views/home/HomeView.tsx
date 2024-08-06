import { ref, defineComponent } from "vue";
import HomeNews from "./components/HomeNews";
import HomeProducts from "./components/HomeProducts";
import Breadcrumb from "@/components/Breadcrumb";

export default defineComponent({
    props: {},
    emits: [],
    setup(props, { emit }) {
        return () => (
            <section>
                <div class="relative py-[20px] xl:py-[30px] px-[20px] xl:px-[30px]">
                    <div class="xl:max-w-[1300px] mx-auto">
                        <Breadcrumb customClass="mb-[30px]" />
                        <HomeNews />
                        <HomeProducts />
                    </div>
                </div>
            </section>
        );
    },
});
