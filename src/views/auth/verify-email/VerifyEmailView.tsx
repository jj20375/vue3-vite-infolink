import { defineComponent } from "vue";

export default defineComponent({
    name: "VerifyEmailView",
    props: {},
    emits: [],
    setup(props, { emit }) {
        return () => (
            <div>
                <div class="flex items-center justify-center w-full h-screen">
                    <font-awesome-icon class="animate-spin text-[40px] text-gray-300" icon={["fas", "circle-notch"]} />
                </div>
            </div>
        );
    },
});
