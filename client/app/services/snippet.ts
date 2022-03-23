import { AxiosResponse } from "axios";
import { axiosInstance } from "~/services/axiosInstance";

export type ApiSnippet = {
  id: number;
  url: string;
  highlight: string;
  title: string;
  code: string;
  linenos: boolean;
  language: string;
  style: string;
  owner: string;
};

export interface getSnippetsResponse {
  count: number;
  next: number;
  previous: number;
  results: ApiSnippet[];
}

export const getSnippets = async (): Promise<
  AxiosResponse<getSnippetsResponse>
> => {
  return axiosInstance.get("/api/snippets/");
};

export const getSnippet = async (
  id: string
): Promise<AxiosResponse<ApiSnippet>> => {
  return axiosInstance.get(`/api/snippets/${id}`);
};

export const getSnippetHighlight = async (
  id: string
): Promise<AxiosResponse<string>> => {
  return axiosInstance.get(`/api/snippets/${id}/highlight`);
};
