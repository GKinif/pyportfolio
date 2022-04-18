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

    const searchParams: GetBudgetEntriesParams = {
      amount__lte: url.searchParams.get("amount__lte") ?? undefined,
      amount__gte: url.searchParams.get("amount__gte") ?? undefined,
      date: url.searchParams.get("date") ?? undefined,
      date__lte: url.searchParams.get("date__lte") ?? undefined,
      date__gte: url.searchParams.get("date__gte") ?? undefined,
      date__year: url.searchParams.get("date__year") ?? undefined,
      date__month: url.searchParams.get("date__month") ?? undefined,
      description: url.searchParams.get("description") ?? undefined,
      order: url.searchParams.get("order") ?? undefined,
    };

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
  const [showFilters, setShowFilters] = useState(false);
  const isSubmitting = transition.state === "submitting";

  return (
    <section>
      <Text sx={{ marginBottom: theme.spacing.xs }}>
        <Link to={`/budgets/${params.id}`}>Budget overview</Link>
      </Text>

      <Button
        sx={{ marginBottom: theme.spacing.xs }}
        onClick={() => setShowFilters((prev) => !prev)}
      >
        Filter
      </Button>

      <Collapse in={showFilters}>
        <Paper
          shadow="sm"
          p="md"
          withBorder
          sx={{ marginBottom: theme.spacing.xs }}
        >
          <Form method="post">
            <input
              type="hidden"
              name="search"
              value={searchParams.toString()}
            />
            <TextInput
              name="description"
              placeholder="Description..."
              label="Description"
              error={
                actionData?.errors?.fieldErrors?.description ??
                actionData?.errors?.description
              }
              defaultValue={actionData?.values?.description}
              disabled={transition.state === "submitting"}
              sx={{ paddingBottom: theme.spacing.xs }}
            />

            <Group>
              <NumberInput
                name="amount__gte"
                placeholder="10.56"
                label="Minimum amount"
                min={0}
                step={0.01}
                precision={2}
                decimalSeparator="."
                error={
                  actionData?.errors?.fieldErrors?.amount__gte ??
                  actionData?.errors?.amount__gte
                }
                defaultValue={actionData?.values?.amount__gte}
                disabled={transition.state === "submitting"}
                sx={{ paddingBottom: theme.spacing.xs }}
              />

              <NumberInput
                name="amount__lte"
                placeholder="10.56"
                label="Maximum amount"
                min={0}
                step={0.01}
                precision={2}
                decimalSeparator="."
                error={
                  actionData?.errors?.fieldErrors?.amount__lte ??
                  actionData?.errors?.amount__lte
                }
                defaultValue={actionData?.values?.amount__lte}
                disabled={transition.state === "submitting"}
                sx={{ paddingBottom: theme.spacing.xs }}
              />
            </Group>

            <Group>
              <DatePicker
                name="date__gte"
                placeholder="Pick date"
                label="From"
                defaultValue={actionData?.values?.date ?? undefined}
                disabled={transition.state === "submitting"}
                error={
                  actionData?.errors?.fieldErrors?.date ??
                  actionData?.errors?.date
                }
                sx={{ marginBottom: theme.spacing.xs }}
              />
              <DatePicker
                name="date__lte"
                placeholder="Pick date"
                label="To"
                defaultValue={actionData?.values?.date ?? undefined}
                disabled={transition.state === "submitting"}
                error={
                  actionData?.errors?.fieldErrors?.date ??
                  actionData?.errors?.date
                }
                sx={{ marginBottom: theme.spacing.xs }}
              />

              <NativeSelect
                name="date__month"
                label="Month"
                placeholder="Pick one"
                defaultValue={actionData?.values?.date__month}
                disabled={transition.state === "submitting"}
                error={
                  actionData?.errors?.fieldErrors?.date__month ??
                  actionData?.errors?.date__month
                }
                sx={{ marginBottom: theme.spacing.xs }}
                data={[
                  { label: "---", value: "" },
                  { label: "January", value: "1" },
                  { label: "February", value: "2" },
                  { label: "March", value: "3" },
                  { label: "April", value: "4" },
                  { label: "May", value: "5" },
                  { label: "June", value: "6" },
                  { label: "July", value: "7" },
                  { label: "August", value: "8" },
                  { label: "September", value: "9" },
                  { label: "October", value: "10" },
                  { label: "November", value: "11" },
                  { label: "December", value: "12" },
                ]}
              />

              <NativeSelect
                name="date__year"
                label="Year"
                placeholder="Pick one"
                defaultValue={actionData?.values?.date__year}
                disabled={transition.state === "submitting"}
                error={
                  actionData?.errors?.fieldErrors?.date__year ??
                  actionData?.errors?.date__year
                }
                sx={{ marginBottom: theme.spacing.xs }}
                data={[
                  { label: "---", value: "" },
                  ...range(2000, 2022).map((value) => ({
                    label: "" + value,
                    value: "" + value,
                  })),
                ]}
              />
            </Group>

            <Group>
              <Button type="submit" variant="outline" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>

              {actionData?.errors?.detail ? (
                <Text color="red">{actionData?.errors.detail}</Text>
              ) : null}
            </Group>
          </Form>
        </Paper>
      </Collapse>

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
