import {AxiosResponse} from "axios";
import {axiosInstance} from "~/services/axiosInstance";

export type ApiEntry = {
  id: number;
  description: string;
  amount: number;
  category: string;
  created: string;
  updated: string;
}

export type ApiBudget = {
  id: number;
  title: string;
  description?: string;
  date: string;
  is_positive: boolean;
  created: string;
  updated: string;
  entries?: ApiEntry[]
};

export interface getBudgetsResponse {
  count: number;
  next: number;
  previous: number;
  results: ApiBudget[];
}

export const getBudgets = async (): Promise<AxiosResponse<getBudgetsResponse>> => {
  return axiosInstance.get("/api/budgets/budgets");
};

export const getBudget = async (
  id: string
): Promise<AxiosResponse<ApiBudget>> => {
  return axiosInstance.get(`/api/budgets/budgets/${id}`);
};
