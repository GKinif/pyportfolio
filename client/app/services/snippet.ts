export type ApiSnippet = {
  "id": number;
  "url": string;
  "highlight": string;
  "title": string;
  "code": string;
  "linenos": boolean;
  "language": string;
  "style": string;
  "owner": string;
};

export interface getSnippetsResponse {
  "count": number;
  "next": number;
  "previous": number;
  "results": ApiSnippet[];
}

export const getSnippets = async (): Promise<getSnippetsResponse> => {
  const res = await fetch("http://localhost:8000/api/snippets/");

  return res.json();
};

export const getSnippet = async (id: string): Promise<ApiSnippet> => {
  const res = await fetch(`http://localhost:8000/api/snippets/${id}`);

  return res.json();
};

export const getSnippetHighlight = async (id: string): Promise<string> => {
  const res = await fetch(`http://localhost:8000/api/snippets/${id}/highlight`);

  return res.text();
};