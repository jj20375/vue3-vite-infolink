import axios from "@/services/axiosConfig";
import type {
    UserPanelUserInfoInterface,
    UserSubAccountsAPIInterface,
    UserUpdateProfileAPIInterface,
} from "@/views/user-panel/user-info/interface/userInterface";
const apiURL = import.meta.env.VITE_API_URL;

/**
 * 取得使用者資料
 * @returns
 */
export function GetUserProfileAPI(): Promise<{
    data: UserPanelUserInfoInterface;
}> {
    return axios.get(`${apiURL}/member/profile`);
}

/**
 * 更新使用者資料
 */
export function UpdateUserProfileAPI(data: UserUpdateProfileAPIInterface) {
    return axios.post(`${apiURL}/member/update-profile`, data);
}

/**
 * 取得使用者底下的子帳號列表
 */
export function GetSubAccountsAPI(): Promise<{
    data: UserSubAccountsAPIInterface;
}> {
    return axios.get(`${apiURL}/member/sub-account-list`);
}
