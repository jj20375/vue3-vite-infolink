import axios from "@/services/axiosConfig";
import type {
    UserChangePasswordRequestAPIInterface,
    UserPanelUserInfoResponseAPIInterface,
    UserSubAccountsResponseAPIInterface,
    UserUpdateProfileRequestAPIInterface,
} from "@/views/user-panel/user-info/interface/userInterface";
const apiURL = import.meta.env.VITE_API_URL;

/**
 * 取得使用者資料
 * @returns
 */
export function GetUserProfileAPI(): Promise<{
    data: UserPanelUserInfoResponseAPIInterface;
}> {
    return axios.get(`${apiURL}/member/profile`);
}

/**
 * 更新使用者資料
 */
export function UpdateUserProfileAPI(
    data: UserUpdateProfileRequestAPIInterface
) {
    return axios.post(`${apiURL}/member/update-profile`, data);
}

/**
 * 取得使用者底下的子帳號列表
 */
export function GetSubAccountsAPI(): Promise<{
    data: UserSubAccountsResponseAPIInterface;
}> {
    return axios.get(`${apiURL}/member/sub-account-list`);
}

/**
 * 修改密碼 api
 */
export function UserChangePasswordAPI(
    data: UserChangePasswordRequestAPIInterface
) {
    return axios.post(`${apiURL}/member/change-password`, data);
}
