import {
  ActionFunction,
  json,
  Link,
  LoaderFunction,
  redirect,
  useActionData,
  useOutletContext,
  useLoaderData,
  useParams,
  useTransition,
} from "remix";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveBar } from "@nivo/bar";
import Color from "color";

import { CategoryOverview, getBudgetOverview } from "~/services/budgets";
import { Box, useMantineTheme, Text } from "@mantine/core";
import dayjs from "dayjs";
import { getEntrySearchParams } from "~/utils/entryFilters";
import { EntryFilters } from "~/components/EntryFilters";
import { stringToColour } from "~/utils/color";

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
  totalSum: number;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  if (!params.id) {
    throw new Response("Not Found", { status: 404 });
  }

  const url = new URL(request.url);
  const searchParams = getEntrySearchParams(url.searchParams);

  const overviewResponse = await getBudgetOverview(params.id, searchParams);

  let sum = 0;

  const transformed = overviewResponse.data.months.reduce(
    (acc: Record<string, Record<string, number | string>>, val) => {
      const prevData = acc[val.month] ?? {};
      const negative_sum = parseFloat(val.negative_sum ?? "0");
      const positive_sum = parseFloat(val.positive_sum ?? "0");
      sum = sum + negative_sum + positive_sum;
      return {
        ...acc,
        [val.month]: {
          ...prevData,
          [val.category__title]: negative_sum + positive_sum,
        },
      };
    },
    {}
  );

  const months = Object.entries(transformed).map(([key, value]) => {
    return { ...value, month: key };
  });

  return json({
    categories: overviewResponse.data.categories,
    months,
    totalSum: sum,
  });
};

import type { ContextType } from "../$id";
import { useMemo } from "react";
import { isEmpty, isNil } from "ramda";

export default function BudgetOverview() {
  const theme = useMantineTheme();
  const transition = useTransition();
  const data = useLoaderData<LoaderData>();
  const { budget } = useOutletContext<ContextType>();
  const actionData = useActionData();
  const params = useParams();
  const isSubmitting = transition.state === "submitting";

  const maxPieAngle = useMemo(() => {
    const parsed = parseFloat(budget?.base);
    if (
      isNil(data?.months) ||
      isEmpty(data.months) ||
      data.months.length > 1 ||
      isNil(parsed)
    ) {
      return 360;
    }

    return Math.min((data.totalSum / parsed) * 360, 360);
  }, [budget, data]);

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
            colors={({ id, data }) => stringToColour(`${id}`)}
            markers={[
              {
                axis: "y",
                value: 2000,
                lineStyle: { stroke: "rgba(0, 0, 0, .35)", strokeWidth: 2 },
                legend: "Base",
                legendOrientation: "vertical",
              },
            ]}
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
            labelTextColor={(datum) =>
              Color(stringToColour(`${datum.data.id}`)).isLight()
                ? "black"
                : "white"
            }
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
            colors={{ scheme: "set3" }}
            value={(v: CategoryOverview) => parseFloat(v.negative_sum ?? "0")}
            valueFormat={(v) => `${v}€`}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            endAngle={maxPieAngle}
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
