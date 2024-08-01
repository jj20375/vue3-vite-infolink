import { ref } from "vue";
import { defineStore } from "pinia";
import IconLogo1 from "@/assets/img/logo/logo-1.svg";
import IconLogo2 from "@/assets/img/logo/logo-2.svg";
import { GetInitAPI } from "@/api/utilsAPI";

const defaultInitData = {
    site: {
        site_name: "InfoLink Consulting Co., Ltd",
        site_logo: IconLogo1,
        site_logo2: "@/assets/img/logo/logo-2.svg", // TODO 新增第二個logo欄位
        site_favicon: "https://yale_backed.mrjin.me/storage/favicon.svg",
        site_preview_thumbnail:
            "https://yale_backed.mrjin.me/storage/preview_thumbnail.svg",
        contact_phone: "+886-2-2716-3123",
        contact_email: "service@infolink-group.com",
        contact_address: "104 台北市中山區建國北路二段 120 號 15 樓",
        contact_google_map: "https://maps.app.goo.gl/8YGPtwemuqu22WY6A", // TODO 新增google map欄位
        contact_sales: "jackie.liao@infolink-group.com", // TODO 新增sales email欄位
        fax_number: null,
        business_hours: "週一至週五 9:00 - 18:00",
        notes: "我們不接受支票付款", // TODO api 缺少備註欄位
        maintenance_mode: false,
        social_line: "",
        social_linkedin: "https://www.google.com.tw/webhp?hl=zh-TW", // TODO 社群有改
        social_twitter: "https://www.google.com.tw/webhp?hl=zh-TW",
        social_wechat: "https://www.google.com.tw/webhp?hl=zh-TW",
        social_facebook: "https://www.google.com.tw/webhp?hl=zh-TW",
        social_youtube: "https://www.google.com.tw/webhp?hl=zh-TW",
        social_datafactory: null,
        meta_title: "InfoLink",
        meta_description: "CodePulse",
        meta_keywords: ["可思科技", "網頁設計", "網站架設", "購物車"],
        google_analytic_code: null,
        // facebook_pixel_code: null,
        // google_tag_manager_head_code: null,
        // google_tag_manager_body_code: null,
    },
};

export const useInitStore = defineStore("initStore", () => {
    // 判斷是否有取得初始化資料
    const isGetInitData = ref(false);

    // 初始化資料
    const initData = ref(defaultInitData);

    /**
     * 設定初始化資料
     */
    function setInitData(data: any): void {
        initData.value = {
            site: {
                site_name: data.name,
                site_logo: data.logo.black,
                site_logo2: data.logo.white,
                site_favicon: data.favicon,
                site_preview_thumbnail: data.preview_thumbnail,
                contact_phone: data.business_phone,
                contact_email: data.business_email,
                contact_address: data.address,
                contact_google_map: "",
                contact_sales: data.email,
                fax_number: data.fax,
                business_hours: data.business_hours,
                notes: "",
                // 判斷是否維護中
                maintenance_mode: data.maintenance_mode,
                meta_description: data.meta_description,
                meta_keywords: data.meta_keywords,
                meta_title: data.meta_title,
                social_datafactory: data.social_datafactory,
                social_facebook: data.social_facebook,
                social_linkedin: data.social_linkedin,
                social_twitter: data.social_twitter,
                social_wechat: data.social_wechat,
                social_youtube: data.social_youtube,
                social_line: "",
                google_analytic_code: null,
            },
        };
    }
    /**
     * 設定確認已取得初始化資料
     */
    function setIsGetInitData(): void {
        isGetInitData.value = true;
    }
    /**
     * 取得初始化資料
     */
    async function getInitData() {
        try {
            const { data } = await GetInitAPI();
            setInitData(data.data);
            setIsGetInitData();
        } catch (err) {
            console.log("GetInitAPI err =>", err);
        }
    }

    return {
        initData,
        setInitData,
        getInitData,
        isGetInitData,
        setIsGetInitData,
    };
});
