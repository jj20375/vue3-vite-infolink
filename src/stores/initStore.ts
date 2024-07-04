import { ref } from "vue";
import { defineStore } from "pinia";
import IconLogo1 from "@/assets/img/logo/logo-1.svg";
import IconLogo2 from "@/assets/img/logo/logo-2.svg";
export const useInitStore = defineStore("initStore", () => {
    // 初始化資料
    const initData = ref({
        site: {
            site_name: "InfoLink Consulting Co., Ltd",
            site_logo: IconLogo1,
            site_logo2: "@/assets/img/logo/logo-2.svg", // TODO 新增第二個logo欄位
            site_favicon: "https://yale_backed.mrjin.me/storage/favicon.svg",
            site_preview_thumbnail: "https://yale_backed.mrjin.me/storage/preview_thumbnail.svg",
            contact_phone: "+886-2-2716-3123",
            contact_email: "service@infolink-group.com",
            contact_address: "104 台北市中山區建國北路二段 120 號 15 樓",
            contact_google_map: "https://maps.app.goo.gl/8YGPtwemuqu22WY6A", // TODO 新增google map欄位
            contact_sales: "jackie.liao@infolink-group.com", // TODO 新增sales email欄位
            fax_number: null,
            business_hours: "週一至週五 9:00 - 18:00",
            notes: "我們不接受支票付款",
            maintenance_mode: false,
            social_line: "",
            social_linkedin: "https://www.google.com.tw/webhp?hl=zh-TW", // TODO 社群有改
            social_twitter: "https://www.google.com.tw/webhp?hl=zh-TW",
            social_wechat: "https://www.google.com.tw/webhp?hl=zh-TW",
            social_facebook: "https://www.google.com.tw/webhp?hl=zh-TW",
            social_youtube: "https://www.google.com.tw/webhp?hl=zh-TW",
            meta_title: "InfoLink",
            meta_description: "CodePulse",
            meta_keywords: ["可思科技", "網頁設計", "網站架設", "購物車"],
            facebook_pixel_code: null,
            google_analytic_code: null,
            google_tag_manager_head_code: null,
            google_tag_manager_body_code: null,
            product_categories: [],
            renovation_categories: [],
            stronghold_categories: [],
            socialite_providers: {
                line: "https://yale-third-party.mrjin.me/socialite/line/redirect",
                google: "https://yale-third-party.mrjin.me/socialite/google/redirect",
                facebook: "https://yale-third-party.mrjin.me/socialite/facebook/redirect",
            },
        },
    });
    return { initData };
});
