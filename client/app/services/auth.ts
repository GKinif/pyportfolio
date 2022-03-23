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
