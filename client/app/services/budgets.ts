import { AxiosResponse } from "axios";
import { axiosInstance } from "~/services/axiosInstance";

export type ApiEntry = {
  date: string;
  id: number;
  description: string;
  amount: number;
  category: string;
  created: string;
  updated: string;
};

export type ApiCategory = {
  id: number;
  title: string;
  description: string;
  amount: number;
  entries?: ApiEntry[];
  created: string;
  updated: string;
};

export type ApiBudget = {
  id: number;
  title: string;
  description?: string;
  date: string;
  is_positive: boolean;
  created: string;
  updated: string;
  entries?: ApiEntry[];
};

export interface getBudgetsResponse {
  count: number;
  next: number;
  previous: number;
  results: ApiBudget[];
}

export const getBudgets = async (): Promise<
  AxiosResponse<getBudgetsResponse>
> => {
  return axiosInstance.get("/api/budgets/budgets");
};

export const getBudget = async (
  id: string
): Promise<AxiosResponse<ApiBudget>> => {
  return axiosInstance.get(`/api/budgets/budgets/${id}`);
};

export interface EntryData {
  budget: number;
  description: string;
  amount: number;
  date: string;
  is_positive?: boolean;
}

export const addEntryToBudget = async (
  data: EntryData
): Promise<AxiosResponse<EntryData>> => {
  return axiosInstance.post(`/api/budgets/entries/`, data);
};

export const getCategories = async (
  page = 1
): Promise<AxiosResponse<ApiCategory[]>> => {
  return axiosInstance.get(`/api/budgets/categories?page=${page}`);
};

export interface getBudgetEntriesResponse {
  count: number;
  next: number;
  previous: number;
  results: ApiEntry[];
}

export interface GetBudgetEntriesParams {
  amount__lte?: string;
  amount__gte?: string;
  date?: string; // '2022-02-01'
  date__lte?: string; // '2022-02-01'
  date__gte?: string; // '2022-02-01'
  date__year?: string;
  date__month?: string;
  description?: string;
  order?: string; // description, amount, date
}

export const getBudgetEntries = async (
  page = 1,
  params?: GetBudgetEntriesParams
): Promise<AxiosResponse<getBudgetEntriesResponse>> => {
  return axiosInstance.get(`/api/budgets/entries?page=${page}`, { params });
};

export type CategoryOverview = {
  category__title: string;
  positive_sum: string | null;
  negative_sum: string | null;
}

export type MonthOverview =  CategoryOverview & {
  month: string;
}
export type getBudgetOverviewResponse  = {
  categories: CategoryOverview[];
  months: MonthOverview[];
};

export const getBudgetOverview = async (
  budgetId: string,
  params?: GetBudgetEntriesParams
): Promise<AxiosResponse<getBudgetOverviewResponse>> => {
  return axiosInstance.get(`/api/budgets/budgets/${budgetId}/overview`, { params });
};
