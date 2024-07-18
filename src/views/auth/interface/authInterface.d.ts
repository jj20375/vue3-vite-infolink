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
export interface AuthResendLoginEmailVerifyCodeAPIInterface
    extends Omit<AuthLoginEmailVerfiyCodeAPIInterface, "verification_code"> {}

/**
 * 重設密碼 api
 */
export interface AuthResetPasswordInterface {
    password: string;
    password_confirmation: string;
}

/**
 * 忘記密碼時 重設密碼連結發送至信箱 api
 */
export interface AuthForgotPasswordSendResetEmailAPIInterface
    extends Omit<AuthLoginEmailVerfiyCodeAPIInterface, "verification_code"> {
    redirect_url: string;
}

/**
 * 驗證重設密碼連結 api api
 */
export interface AuthForgotPasswordSetNewPasswordAPIInterface
    extends Omit<AuthLoginEmailVerfiyCodeAPIInterface, "verification_code"> {
    token: string;
    password: string;
    password_confirmation: string;
}
