import {
  json,
  Link,
  LoaderFunction,
  redirect,
  useLoaderData,
  useParams,
  useSearchParams,
} from "remix";
import { Pagination, Table, useMantineTheme, Text } from "@mantine/core";

import { getBudgetEntries, getBudgetEntriesResponse } from "~/services/budgets";

const dateFormatter = new Intl.DateTimeFormat("default", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
const formatDate = (date: Date) => {
  if (!date || Object.prototype.toString.call(date) !== "[object Date]") {
    return "";
  }
  return dateFormatter.format(date);
};

const getCurrentPage = (searchParams: URLSearchParams) => {
  const pageParam = searchParams.get("page");
  if (!pageParam) {
    return 1;
  }
  const page = parseInt(pageParam);
  return isNaN(page) ? 1 : page;
};

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
  const theme = useMantineTheme();
  const data = useLoaderData<LoaderData>();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = getCurrentPage(searchParams);

  return (
    <section>
      <Text sx={{ marginBottom: theme.spacing.xs }}>
        <Link to={`/budgets/${params.id}`}>Budget overview</Link>
      </Text>

      <Pagination
        page={currentPage}
        total={Math.ceil(data.count / 10)}
        siblings={1}
        size="sm"
        onChange={(page) => {
          setSearchParams({ page: `${page}` }, { replace: true });
        }}
        sx={{ marginBottom: theme.spacing.xs, justifyContent: "flex-end" }}
      />

      <Table striped highlightOnHover sx={{ marginBottom: theme.spacing.xs }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Name</th>
          </tr>
        </thead>

        <tbody>
          {data.results.map((entry) => (
            <tr key={entry.id}>
              <td>{formatDate(new Date(entry.date))}</td>
              <td>{entry.category}</td>
              <td>{entry.amount}€</td>
              <td>{entry.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination
        page={currentPage}
        total={Math.ceil(data.count / 10)}
        siblings={1}
        size="sm"
        onChange={(page) => {
          setSearchParams({ page: `${page}` }, { replace: true });
        }}
        sx={{ justifyContent: "flex-end" }}
      />
    </section>
  );
}
