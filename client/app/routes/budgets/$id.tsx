import {
  json,
  useLoaderData,
  LoaderFunction,
  ActionFunction,
  useActionData,
  Form,
  useTransition,
  Outlet,
  useCatch,
  redirect,
  Link,
} from "remix";
import {
  Button,
  Group,
  NativeSelect,
  NumberInput,
  Paper,
  Radio,
  RadioGroup,
  Text,
  TextInput,
  Title,
  Collapse,
  useMantineTheme,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import {
  addEntryToBudget,
  ApiBudget,
  ApiCategory,
  EntryData,
  getBudget,
  getCategories,
} from "~/services/budgets";
import { commitSession, getSession } from "~/session";
import {
  number,
  object,
  string,
  ZodError,
  date,
  boolean,
  preprocess,
} from "zod";
import { createNotification } from "~/components/Notification";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

dayjs.extend(customParseFormat);

const entrySchema = object({
  budget: preprocess((val) => parseInt(val as string), number()),
  description: string(),
  amount: preprocess((val) => parseFloat(val as string), number()),
  category: preprocess((val) => parseInt(val as string), number()),
  date: preprocess((val) => new Date(val as string), date()).transform((val) =>
    dayjs(val).format("YYYY-MM-DD")
  ),
  is_positive: preprocess((val) => val === "true", boolean()),
});

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  let parsedData: EntryData;

  try {
    parsedData = entrySchema.parse(values);
  } catch (error) {
    if (error instanceof ZodError) {
      const formErrors: any = error.flatten();
      return json({ errors: formErrors, values });
    }
    return json({
      errors: { non_field_errors: ["Unexpected errors"] },
      values,
    });
  }

  try {
    const response = await addEntryToBudget(parsedData);

    createNotification(session, {
      severity: "success",
      title: "Congratulation",
      message: `response.data.description added to budget.`,
    });

    // Login succeeded, send them to the home page.
    return json(
      {
        data: response.data,
      },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return json({
        errors: error.response?.data,
        values,
      });
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      return json({
        errors: { non_field_errors: ["Unable to reach server"] },
        values,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return json({
        errors: { non_field_errors: ["Unexpected errors"] },
        values,
      });
    }
  }
};

interface Data {
  budget: ApiBudget;
  categories: ApiCategory[];
}

export const loader: LoaderFunction = async ({ params, request }) => {
  try {
    const budgetResponse = await getBudget(params.id ?? "");
    const categoriesResponse = await getCategories();

    return json({
      budget: budgetResponse.data,
      categories: categoriesResponse.data,
    });
  } catch (error: any) {
    if (error.response.status === 401) {
      return redirect(`/login?backTo=/budgets/${params.id}`);
    }
    throw new Response("Request Error", {
      status: error.response?.status ?? 500,
    });
  }
};

export default function Budget() {
  const theme = useMantineTheme();
  const transition = useTransition();
  const { budget, categories } = useLoaderData<Data>();
  const actionData = useActionData();
  const [opened, setOpen] = useState(false);
  const isSubmitting = transition.state === "submitting";
  const descriptionRef = useRef<HTMLInputElement>();

  useEffect(() => {
    if (!isSubmitting && descriptionRef.current) {
      descriptionRef.current.value = "";
      descriptionRef.current.focus();
    }
  }, [isSubmitting]);

  return (
    <main>
      <Title order={1} sx={{ marginBottom: theme.spacing.md }}>
        {budget.title}
      </Title>

      <Text sx={{ marginBottom: theme.spacing.md }}>{budget.description}</Text>

      <Button
        onClick={() => setOpen((o) => !o)}
        sx={{ marginBottom: theme.spacing.xs }}
      >
        {opened ? "Close" : "Add new entry"}
      </Button>

      <Collapse in={opened}>
        <Paper
          shadow="sm"
          p="md"
          withBorder
          sx={{ marginBottom: theme.spacing.xs }}
        >
          <Title order={2}>New entry</Title>
          <Form method="post">
            <input type="hidden" name="budget" value={budget.id} />
            <TextInput
              ref={descriptionRef as any}
              name="description"
              placeholder="Description..."
              label="Description"
              error={
                actionData?.errors?.fieldErrors?.description ??
                actionData?.errors?.description
              }
              defaultValue={actionData?.values?.description}
              disabled={transition.state === "submitting"}
              required
              sx={{ paddingBottom: theme.spacing.xs }}
            />

            <Group>
              <NumberInput
                name="amount"
                placeholder="10.56"
                label="Amount"
                min={0}
                step={0.01}
                precision={2}
                decimalSeparator="."
                error={
                  actionData?.errors?.fieldErrors?.amount ??
                  actionData?.errors?.amount
                }
                defaultValue={actionData?.values?.amount}
                disabled={transition.state === "submitting"}
                required
                sx={{ paddingBottom: theme.spacing.xs }}
              />

              <NativeSelect
                id="select"
                name="category"
                label="Category"
                placeholder="Pick one"
                defaultValue={actionData?.values?.category}
                disabled={transition.state === "submitting"}
                required
                error={
                  actionData?.errors?.fieldErrors?.category ??
                  actionData?.errors?.category
                }
                sx={{ marginBottom: theme.spacing.xs }}
                data={categories.map((cat) => ({
                  label: cat.title,
                  value: `${cat.id}`,
                }))}
              />

              <DatePicker
                name="date"
                placeholder="Pick date"
                label="Date"
                defaultValue={actionData?.values?.date ?? new Date()}
                disabled={transition.state === "submitting"}
                required
                error={
                  actionData?.errors?.fieldErrors?.date ??
                  actionData?.errors?.date
                }
                sx={{ marginBottom: theme.spacing.xs }}
              />
            </Group>

            <RadioGroup
              name="is_positive"
              label="Expense / Income"
              description="The expense can either be an Expense (money getting out of your account) or an Income (money getting into your account)"
              spacing="xs"
              defaultValue={actionData?.values?.is_positive ?? "false"}
              error={
                actionData?.errors?.fieldErrors?.is_positive ??
                actionData?.errors?.is_positive
              }
              sx={{ marginBottom: theme.spacing.xs }}
            >
              <Radio
                label="Expense"
                value="false"
                disabled={transition.state === "submitting"}
              />
              <Radio
                label="Income"
                value="true"
                disabled={transition.state === "submitting"}
              />
            </RadioGroup>

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

      <Outlet />
    </main>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <div className="error-container">
        <p>This budget does not exist.</p>
        <Link to="/budgets">Back to Budgets</Link>
      </div>
    );
  }
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.log("error: ", error);
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}
