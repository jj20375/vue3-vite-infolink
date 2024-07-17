/**
 * 驗證登入信箱身份驗證碼 api
 */
export interface AuthLoginEmailVerfiyCodeAPIInterface {
    email: string;
    verification_code: string;
}

/**
 * 重發登入信箱驗證碼 api
 */
export interface AuthResendLoginEmailVerifyCodeAPIInterface extends Omit<AuthLoginEmailVerfiyCodeAPIInterface, "verification_code"> {}

/**
 * 重設密碼
 */
export interface AuthResetPasswordInterface {
    password: string;
    password_confirmation: string;
}
