import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useLoaderData,
  useParams,
  useTransition,
} from "remix";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";

import { CategoryOverview, getBudgetOverview } from "~/services/budgets";
import { Box, useMantineTheme, Text } from "@mantine/core";
import dayjs from "dayjs";
import { getEntrySearchParams } from "~/utils/entryFilters";
import { EntryFilters } from "~/components/EntryFilters";

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

  return redirect(`/budgets/${params.id}?${searchParams.toString()}`);
};

interface LoaderData {
  categories: CategoryOverview[];
  months: Record<string, string | number>[];
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.id) {
    throw new Response("Not Found", { status: 404 });
  }

  const url = new URL(request.url);
  const searchParams = getEntrySearchParams(url.searchParams);

  const overviewResponse = await getBudgetOverview(params.id, searchParams);

  const transformed = overviewResponse.data.months.reduce(
    (acc: Record<string, Record<string, number | string>>, val) => {
      const prevData = acc[val.month] ?? {};
      return {
        ...acc,
        [val.month]: {
          ...prevData,
          [val.category__title]: val.negative_sum ?? 0,
        },
      };
    },
    {}
  );

  const months = Object.entries(transformed).map(([key, value]) => {
    return { ...value, month: key };
  });

  return json({ categories: overviewResponse.data.categories, months });
};

export default function BudgetOverview() {
  const theme = useMantineTheme();
  const transition = useTransition();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData();
  const params = useParams();
  const isSubmitting = transition.state === "submitting";

  return (
    <section>
      <Text sx={{ marginBottom: theme.spacing.xs }}>
        <Link to={`/budgets/${params.id}/details`}>Budget details</Link>
      </Text>

      <EntryFilters
        filterData={actionData}
        isSubmitting={isSubmitting}
        exclude={["description", "amount__gte", "amount__lte"]}
      />

      <Box sx={{ width: "100%", height: "50vh" }}>
        {!!(global as any).ResizeObserver && (
          <ResponsiveBar
            data={data.months}
            keys={data.categories.map((val) => val.category__title)}
            indexBy="month"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.2}
            colors={{ scheme: "nivo" }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Month",
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Amount",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            animate={true}
          />
        )}
      </Box>

      <Box sx={{ width: "100%", height: "50vh" }}>
        {!!(global as any).ResizeObserver && (
          <ResponsivePie
            data={data.categories}
            id="category__title"
            value={(v: CategoryOverview) => parseFloat(v.negative_sum ?? "0")}
            valueFormat={(v) => `${v}€`}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.7}
            padAngle={1}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: "color",
              modifiers: [["darker", 0.2]],
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={15}
            arcLabelsTextColor={{
              from: "color",
              modifiers: [["darker", 2]],
            }}
            defs={[
              {
                id: "dots",
                type: "patternDots",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: "lines",
                type: "patternLines",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
            fill={[
              {
                match: {
                  id: "Utilities",
                },
                id: "dots",
              },
              {
                match: {
                  id: "Transportation",
                },
                id: "lines",
              },
            ]}
          />
        )}
      </Box>
    </section>
  );
}
