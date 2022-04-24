import {
  Button,
  Collapse,
  Group,
  NativeSelect,
  NumberInput,
  Paper,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { Form, useSearchParams } from "remix";
import { DatePicker } from "@mantine/dates";
import { range } from "~/utils/number";
import { useState } from "react";

type ExcludedField =
  | "description"
  | "amount__gte"
  | "amount__lte"
  | "date__gte"
  | "date__lte"
  | "date__month"
  | "date__year";

type Props = {
  filterData: any;
  isSubmitting: boolean;
  exclude?: ExcludedField[];
};

export const EntryFilters = ({
  filterData,
  isSubmitting,
  exclude = [],
}: Props) => {
  const theme = useMantineTheme();
  const [showFilters, setShowFilters] = useState(false);
  const [searchParams] = useSearchParams();

  return (
    <>
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

            {!exclude?.includes("description") && (
              <TextInput
                name="description"
                placeholder="Description..."
                label="Description"
                error={
                  filterData?.errors?.fieldErrors?.description ??
                  filterData?.errors?.description
                }
                defaultValue={
                  filterData?.values?.description ??
                  searchParams.get("description")
                }
                disabled={isSubmitting}
                sx={{ paddingBottom: theme.spacing.xs }}
              />
            )}

            <Group>
              {!exclude?.includes("amount__gte") && (
                <NumberInput
                  name="amount__gte"
                  placeholder="10.56"
                  label="Minimum amount"
                  min={0}
                  step={0.01}
                  precision={2}
                  decimalSeparator="."
                  error={
                    filterData?.errors?.fieldErrors?.amount__gte ??
                    filterData?.errors?.amount__gte
                  }
                  defaultValue={
                    filterData?.values?.amount__gte ??
                    searchParams.get("amount__gte")
                  }
                  disabled={isSubmitting}
                  sx={{ paddingBottom: theme.spacing.xs }}
                />
              )}

              {!exclude?.includes("amount__lte") && (
                <NumberInput
                  name="amount__lte"
                  placeholder="10.56"
                  label="Maximum amount"
                  min={0}
                  step={0.01}
                  precision={2}
                  decimalSeparator="."
                  error={
                    filterData?.errors?.fieldErrors?.amount__lte ??
                    filterData?.errors?.amount__lte
                  }
                  defaultValue={
                    filterData?.values?.amount__lte ??
                    searchParams.get("amount__lte")
                  }
                  disabled={isSubmitting}
                  sx={{ paddingBottom: theme.spacing.xs }}
                />
              )}
            </Group>

            <Group>
              {!exclude?.includes("date__gte") && (
                <DatePicker
                  name="date__gte"
                  placeholder="Pick date"
                  label="From"
                  defaultValue={
                    filterData?.values?.date__gte ??
                    new Date(searchParams.get("date__gte") ?? Date.now())
                  }
                  disabled={isSubmitting}
                  error={
                    filterData?.errors?.fieldErrors?.date__gte ??
                    filterData?.errors?.date__gte
                  }
                  sx={{ marginBottom: theme.spacing.xs }}
                />
              )}

              {!exclude?.includes("date__lte") && (
                <DatePicker
                  name="date__lte"
                  placeholder="Pick date"
                  label="To"
                  defaultValue={
                    filterData?.values?.date__lte ??
                    new Date(searchParams.get("date__lte") ?? Date.now())
                  }
                  disabled={isSubmitting}
                  error={
                    filterData?.errors?.fieldErrors?.date__lte ??
                    filterData?.errors?.date__lte
                  }
                  sx={{ marginBottom: theme.spacing.xs }}
                />
              )}

              {!exclude?.includes("date__month") && (
                <NativeSelect
                  name="date__month"
                  label="Month"
                  placeholder="Pick one"
                  defaultValue={
                    filterData?.values?.date__month ??
                    searchParams.get("date__month")
                  }
                  disabled={isSubmitting}
                  error={
                    filterData?.errors?.fieldErrors?.date__month ??
                    filterData?.errors?.date__month
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
              )}

              {!exclude?.includes("date__year") && (
                <NativeSelect
                  name="date__year"
                  label="Year"
                  placeholder="Pick one"
                  defaultValue={
                    filterData?.values?.date__year ??
                    searchParams.get("date__year")
                  }
                  disabled={isSubmitting}
                  error={
                    filterData?.errors?.fieldErrors?.date__year ??
                    filterData?.errors?.date__year
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
              )}
            </Group>

            <Group>
              <Button type="submit" variant="outline" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>

              {filterData?.errors?.detail ? (
                <Text color="red">{filterData?.errors.detail}</Text>
              ) : null}
            </Group>
          </Form>
        </Paper>
      </Collapse>
    </>
  );
};
