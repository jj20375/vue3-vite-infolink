import axios from "@/services/axiosConfig";
import type {
    UserPanelUserInfoInterface,
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
