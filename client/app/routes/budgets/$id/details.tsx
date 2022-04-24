import {
  ActionFunction,
  Form,
  json,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useParams,
  useSearchParams,
  useTransition,
} from "remix";
import {
  Pagination,
  Table,
  useMantineTheme,
  Text,
  Button,
  Paper,
  Title,
  TextInput,
  Group,
  NumberInput,
  NativeSelect,
  RadioGroup,
  Radio,
  Collapse,
} from "@mantine/core";

import {
  getBudgetEntries,
  GetBudgetEntriesParams,
  getBudgetEntriesResponse,
} from "~/services/budgets";
import { updateSearchParams } from "~/utils/url";
import { useState } from "react";
import { DatePicker } from "@mantine/dates";
import { range } from "~/utils/number";
import dayjs from "dayjs";
import {EntryFilters} from "~/components/EntryFilters";
import {getEntrySearchParams} from "~/utils/entryFilters";

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

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  const previousSearchParams = new URLSearchParams(
    (formData.get("search") as string) ?? ""
  );

  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (value && typeof value === "string" && value.length > 0) {
      if (["date__lte", "date__gte"].includes(key)) {
        searchParams.set(key, dayjs(new Date(value)).format("YYYY-MM-DD"));
      } else {
        searchParams.set(key, value);
      }
    }
  }

  if (previousSearchParams.get("order")) {
    searchParams.set("order", previousSearchParams.get("order") ?? "");
  }

  if (previousSearchParams.get("page")) {
    searchParams.set("page", previousSearchParams.get("page") ?? "");
  }

  searchParams.delete("search");

  return redirect(`/budgets/${params.id}/details?${searchParams.toString()}`);
};

type LoaderData = getBudgetEntriesResponse;

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const pageParam = parseInt(url.searchParams.get("page") ?? "");
    const page = isNaN(pageParam) ? 1 : pageParam;

    const searchParams = getEntrySearchParams(url.searchParams);

    const entriesResponse = await getBudgetEntries(page, searchParams);

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
  const transition = useTransition();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData();
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = getCurrentPage(searchParams);
  const currentOrder = searchParams.get("order");
  const isSubmitting = transition.state === "submitting";

  return (
    <section>
      <Text sx={{ marginBottom: theme.spacing.xs }}>
        <Link to={`/budgets/${params.id}`}>Budget overview</Link>
      </Text>

      <EntryFilters filterData={actionData} isSubmitting={isSubmitting} />

      <Pagination
        page={currentPage}
        total={Math.ceil(data.count / 10)}
        siblings={1}
        size="sm"
        onChange={(page) => {
          setSearchParams(
            updateSearchParams("page", `${page}`, searchParams.toString()),
            {
              replace: true,
            }
          );
        }}
        sx={{ marginBottom: theme.spacing.xs, justifyContent: "flex-end" }}
      />

      <Table striped highlightOnHover sx={{ marginBottom: theme.spacing.xs }}>
        <thead>
          <tr>
            <th style={{ width: "12ch" }}>
              <Link
                to={updateSearchParams(
                  "order",
                  currentOrder === "date" ? "-date" : "date",
                  searchParams.toString()
                )}
              >
                Date
              </Link>
            </th>
            <th style={{ width: "12ch" }}>Category</th>
            <th style={{ width: "15ch" }}>
              <Link
                to={updateSearchParams(
                  "order",
                  currentOrder === "amount" ? "-amount" : "amount",
                  searchParams.toString()
                )}
              >
                Amount
              </Link>
            </th>
            <th>
              <Link
                to={updateSearchParams(
                  "order",
                  currentOrder === "description"
                    ? "-description"
                    : "description",
                  searchParams.toString()
                )}
              >
                Description
              </Link>
            </th>
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
