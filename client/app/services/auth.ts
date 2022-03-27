import { AxiosResponse } from "axios";
import { axiosInstance } from "~/services/axiosInstance";

export interface PostLoginData {
  email: string;
  password: string;
}

export interface postLoginResponse {
  auth_token: string;
}

export const postLogin = async (
  data: PostLoginData
): Promise<AxiosResponse<postLoginResponse>> => {
  return axiosInstance.post("/auth/token/login", data);
};

export interface getCurrentUserResponse {
  id: number;
  email: string;
}
export const getCurrentUser = async (): Promise<
  AxiosResponse<getCurrentUserResponse>
> => {
  return axiosInstance.get("/auth/users/me");
};

export const postLogout = async (): Promise<AxiosResponse<unknown>> => {
  return axiosInstance.post("/auth/token/logouttt", {});
};
