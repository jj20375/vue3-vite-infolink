import axios from "@/services/axiosConfig";
import type {
    AuthLoginEmailVerfiyCodeAPIInterface,
    AuthResendLoginEmailVerifyCodeAPIInterface,
    AuthResetPasswordInterface,
    AuthForgotPasswordSendResetEmailAPIInterface,
    AuthForgotPasswordSetNewPasswordAPIInterface,
} from "@/views/auth/interface/authInterface";
const apiURL = import.meta.env.VITE_API_URL;

/**
 * 使用者登入
 * @param data
 * @returns
 */
export function AuthUserLoginAPI(data: any) {
    console.log("import.meta.env =>", import.meta.env);
    return axios.post(`${apiURL}/member/login`, data);
}

/**
 * 驗證登入信箱身份驗證碼
 */
export function AuthLoginEmailVerfiyCodeAPI(
    data: AuthLoginEmailVerfiyCodeAPIInterface
) {
    return axios.post(`${apiURL}/member/verify-login-verification-code`, data);
}

/**
 * 重發登入信箱驗證碼
 */
export function AuthResendLoginEmailVerifyCodeAPI(
    data: AuthResendLoginEmailVerifyCodeAPIInterface
) {
    return axios.post(`${apiURL}/member/send-login-verification-code`, data);
}

/**
 * 重設初始密碼
 */
export function AuthResetInitPasswordAPI(data: AuthResetPasswordInterface) {
    return axios.post(`${apiURL}/member/reset-initial-password`, data);
}

/**
 * 登出
 */
export function AuthLogoutAPI() {
    return axios.post(`${apiURL}/member/logout`);
}

/**
 * 忘記密碼時 重設密碼連結發送至信箱
 */
export function AuthForgotPasswordSendResetEmailAPI(
    data: AuthForgotPasswordSendResetEmailAPIInterface
) {
    return axios.post(`${apiURL}/member/send-reset-password-email`, data);
}

/**
 * 忘記密碼時透過 email 發送信箱連結 重設密碼功能
 */
export function AuthForgotPasswordSetNewPasswordAPI(
    data: AuthForgotPasswordSetNewPasswordAPIInterface
) {
    return axios.post(`${apiURL}/member/verify-reset-password-email`, data);
}
