import {
  json,
  Link,
  LoaderFunction,
  redirect,
  useLoaderData,
  useParams,
} from "remix";

import { getBudgetEntries, getBudgetEntriesResponse } from "~/services/budgets";

type LoaderData = getBudgetEntriesResponse;

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const pageParam = parseInt(url.searchParams.get("page") ?? "");
    const page = isNaN(pageParam) ? 1 : pageParam;

    const entriesResponse = await getBudgetEntries(page);

    return json(entriesResponse.data);
  } catch (error: any) {
    if (error.response.status === 401) {
      return redirect("/login?backTo=/snippets");
    }
    return redirect("/");
  }
};

export default function BudgetDetails() {
  const data = useLoaderData<LoaderData>();
  const params = useParams();

  return (
    <section>
      <Link to={`/budgets/${params.id}/details`}>Budget details</Link>
    </section>
  );
}
