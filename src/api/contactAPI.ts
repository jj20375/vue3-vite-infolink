import axios from "@/services/axiosConfig";
import type {
    ContactUsFormRequestAPIInterface,
    GetContactUsQuestionCategoriesResponseAPIInterface,
} from "@/views/contact/contactInterface";
const apiURL = import.meta.env.VITE_API_URL;

/**
 * 取得聯絡我們詢問類別 api
 */
export function GetContactUsQuestionCategoriesAPI(): Promise<GetContactUsQuestionCategoriesResponseAPIInterface> {
    return axios.get(`${apiURL}/contact/category-list`);
}

/**
 * 聯絡我們表單 api
 */
export function ContactUsFormAPI(data: ContactUsFormRequestAPIInterface) {
    return axios.post(`${apiURL}/contact/submit`, data);
}
