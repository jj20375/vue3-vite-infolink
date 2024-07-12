import { defineComponent, ref } from "vue";
import vueRecaptcha from "vue3-recaptcha2";
export default defineComponent({
    name: "GoogleReCaptchaV2",
    components: { vueRecaptcha },
    props: { lang: { type: String } },
    setup(props, { emit }) {
        const siteKey = import.meta.GOOGLE_RECAPTCHA_SITE_KEY;
        const setlang = props.lang ? props.lang : "zh-TW";
        const vueRecaptcha = ref<any>(null);
        const refresh = () => {
            if (vueRecaptcha.value) {
                vueRecaptcha.value.reset();
            }
        };
        const recaptchaVerified = (response: any) => {
            emit("update:modelValue", response); //console.log('recaptchaVerified', response) };
        };
        const recaptchaExpired = () => {
            refresh();
        };
        const recaptchaFailed = () => {
            console.log("recaptchaFailed");
        };
        const recaptchaError = (reason: any) => {
            console.log("recaptchaError", reason);
        };
        return () => (
            <vue-recaptcha sitekey="{siteKey}" size="normal" name="recaptchaToken" theme="light" hl="{setlang}" loading-timeout={30000} onVerify={() => recaptchaVerified} onExpire={() => recaptchaExpired} onFail={() => recaptchaFailed} onError={() => recaptchaError} ref="vueRecaptcha">
                {" "}
            </vue-recaptcha>
        );
    },
});
