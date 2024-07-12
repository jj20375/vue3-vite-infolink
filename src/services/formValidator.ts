//密碼驗證
export const validatePassword = (rule: any, value: string, callback: (error?: string | Error) => void) => {
    if (value) {
        const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?\/\\~-]{8,}$/;
        if (!reg.test(value)) {
            callback(new Error());
        } else {
            callback();
        }
    } else {
        callback();
    }
};

//email驗證
export const validateEmail = (rule: any, value: string, callback: (error?: string | Error) => void) => {
    if (value) {
        const reg = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        if (!reg.test(value)) {
            callback(new Error());
        } else {
            callback();
        }
    } else {
        callback();
    }
};
