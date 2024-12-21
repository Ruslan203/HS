export interface LoginOptions {
    name: string;
    password: string;
}

export interface LoginSuccessResult {
    result: "success";
}

export interface LoginErrorResult {
    result: "error";
    reason: string;
}

export type LoginResult = LoginSuccessResult | LoginErrorResult;

export interface SendPasswordOptions {
    phone: string;
}

export interface SendPasswordFailureResult {
    result: "failure";
    reason: string;
}

export interface SendPasswordSuccessResult {
    result: "success";
}

export type SendPasswordResult = SendPasswordSuccessResult | SendPasswordFailureResult;
