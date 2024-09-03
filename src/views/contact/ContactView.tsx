import { defineComponent, computed } from "vue";
import { useInitStore } from "@/stores/initStore";
import Breadcrumb from "@/components/Breadcrumb";
import ContactForm from "./components/ContactForm";
import IconLinkedin from "@/assets/img/icons/medias/linkedin.svg";
import IconTwitter from "@/assets/img/icons/medias/twitter.svg";
import IconWechat from "@/assets/img/icons/medias/wechat.svg";
import IconYoutube from "@/assets/img/icons/medias/youtube.svg";
import IconFacebook from "@/assets/img/icons/medias/facebook.svg";
import { useI18n } from "vue-i18n";

export default defineComponent({
    name: "ContactView",
    props: {},
    emits: [],
    setup(props, { emit }) {
        const { t } = useI18n();
        const initStore = useInitStore();
        const initData = computed(() => initStore.initData);
        function toSocialMedia(socialMedia: { url: string | URL | undefined }) {
            if (socialMedia.url) {
                window.open(socialMedia.url, "_blank");
            }
        }
        // 社群媒體
        const socialMedias = computed<{
            icons: { iconName: any; alt: string; url: string }[];
        }>(() => {
            const arr: { iconName: any; alt: string; url: string }[] = [];
            if (initData.value.site.social_linkedin) {
                arr.push({
                    iconName: IconLinkedin,
                    alt: "linkedin",
                    url: initData.value.site.social_linkedin,
                });
            }
            if (initData.value.site.social_twitter) {
                arr.push({
                    iconName: IconTwitter,
                    alt: "x",
                    url: initData.value.site.social_twitter,
                });
            }
            if (initData.value.site.social_wechat) {
                arr.push({
                    iconName: IconWechat,
                    alt: "wechat",
                    url: initData.value.site.social_wechat,
                });
            }
            if (initData.value.site.social_facebook) {
                arr.push({
                    iconName: IconFacebook,
                    alt: "facebook",
                    url: initData.value.site.social_facebook,
                });
            }
            if (initData.value.site.social_youtube) {
                arr.push({
                    iconName: IconYoutube,
                    alt: "youtube",
                    url: initData.value.site.social_youtube,
                });
            }
            return { icons: arr };
        });

        return () => (
            <section>
                <div class="relative py-[20px] xl:py-[30px] px-[20px] xl:px-[30px]">
                    <Breadcrumb />
                    <h3 class="text-[28px] font-semibold mb-5 sm:mb-7">
                        {t("router.contact")}
                    </h3>
                    <div class="flex flex-col lg:flex-row gap-12">
                        <ContactForm />
                        <div class="text-black-800 flex-1 mb-4 lg:mb-8">
                            <div class="sticky top-[98px]">
                                <div class="font-medium mb-7">
                                    {t("contact.contact-us")}
                                </div>
                                <img
                                    src={initData.value.site.site_logo}
                                    alt=""
                                />
                                {/* <initData.value.site.site_logo /> */}
                                <div class="text-[15px] mt-[24px]">
                                    {initData.value.site.site_name}
                                </div>
                                <div class="text-[15px] mt-[6px] underline underline-offset-2 hover:no-underline">
                                    <a
                                        href={`tel:${initData.value.site.contact_phone}`}
                                    >
                                        {initData.value.site.contact_phone}
                                    </a>
                                </div>
                                <div class="text-[15px] mt-[6px] underline underline-offset-2 hover:no-underline">
                                    <a
                                        href={
                                            initData.value.site
                                                .contact_google_map
                                        }
                                        target="_blank"
                                    >
                                        {initData.value.site.contact_address}
                                    </a>
                                </div>
                                <div class="mt-6">
                                    {t("contact.salesService")}
                                </div>
                                <div class="text-[15px] underline underline-offset-2 hover:no-underline">
                                    <a
                                        href={`mailto:${initData.value.site.contact_email}`}
                                    >
                                        {initData.value.site.contact_email}
                                    </a>
                                </div>
                                <div class="mt-6">
                                    {t("contact.businessContact")}
                                </div>
                                <div class="text-[15px] underline underline-offset-2 hover:no-underline">
                                    <a
                                        href={`mailto:${initData.value.site.contact_sales}`}
                                    >
                                        {initData.value.site.contact_sales}
                                    </a>
                                </div>
                                <ul class="flex justify-center xl:justify-start gap-3 py-8">
                                    {socialMedias.value.icons.map((item) => (
                                        <li key={item.alt}>
                                            <div
                                                onClick={() =>
                                                    toSocialMedia(item)
                                                }
                                                class="flex justify-center items-center !w-[35px] !h-[35px] bg-black-800 rounded-full cursor-pointer hover:bg-yellow-900 transition-all duration-300"
                                            >
                                                <item.iconName class="!w-[35px] !h-[35px] text-white" />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    },
});
