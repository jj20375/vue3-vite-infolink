/**
 * 文件參考
 * https://github.com/hCaptcha/vue-hcaptcha
 */
import { defineComponent, ref } from "vue";
import VueHcaptcha from "@hcaptcha/vue3-hcaptcha";

export default defineComponent({
    name: "Hcaptcha",
    components: { VueHcaptcha },
    setup(props, { emit }) {
        const siteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY;
        const verified = ref(false);
        const expired = ref(false);
        const token = ref("");
        const eKey = ref("");
        const error = ref("");

        function onVerify(tokenStr: string, ekey: string) {
            verified.value = true;
            token.value = tokenStr;
            eKey.value = ekey;
            emit("update:modelValue", token.value);
            console.log(`Callback token: ${tokenStr}, ekey: ${ekey}`);
        }

        function onExpire() {
            verified.value = false;
            token.value = "";
            eKey.value = "";
            expired.value = true;
            emit("update:modelValue", token.value);
            console.log("Expired");
        }

        function onChallengeExpire() {
            verified.value = false;
            token.value = "";
            eKey.value = "";
            expired.value = true;
            emit("update:modelValue", token.value);
            console.log("Challenge expired");
        }

        function onError(err: string) {
            token.value = "";
            eKey.value = "";
            error.value = err;
            emit("update:modelValue", token.value);
            console.log(`Error: ${err}`);
        }
        return () => (
            <vue-hcaptcha
                sitekey={siteKey}
                onVerify={onVerify}
                onExpired={onExpire}
                onChallengeExpired={onChallengeExpire}
                onError={onError}
            />
        );
    },
});
