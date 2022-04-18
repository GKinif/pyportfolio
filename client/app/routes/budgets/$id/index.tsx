import {
  json,
  Link,
  LoaderFunction,
  redirect,
  useLoaderData,
  useParams,
} from "remix";
import {ResponsivePie} from '@nivo/pie';

import {
  CategoryOverview,
  getBudgetOverview,
  getBudgetOverviewResponse
} from "~/services/budgets";
import {Box} from "@mantine/core";

type LoaderData = getBudgetOverviewResponse;

export const loader: LoaderFunction = async ({request, params}) => {
  if (!params.id) {
    throw new Response("Not Found", {status: 404});
  }
  const overviewResponse = await getBudgetOverview(params.id);

  return json(overviewResponse.data);
};

export default function BudgetOverview() {
  const data = useLoaderData<LoaderData>();
  const params = useParams();

  console.log('BudgetOverview: ', data);

  return (
    <section>
      <Link to={`/budgets/${params.id}/details`}>Budget details</Link>

      <Box sx={{width: '100%', height: '50vh'}}>
        {!!(global as any).ResizeObserver && (
          <ResponsivePie
            data={data}
            id="category__title"
            value={(v: CategoryOverview) => parseFloat(v.negative_sum  ?? '0')}
            valueFormat={(v) => `${v}€`}
            margin={{top: 40, right: 80, bottom: 80, left: 80}}
            innerRadius={0.7}
            padAngle={1}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
              from: 'color',
              modifiers: [
                [
                  'darker',
                  0.2
                ]
              ]
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{from: 'color'}}
            arcLabelsSkipAngle={15}
            arcLabelsTextColor={{
              from: 'color',
              modifiers: [
                [
                  'darker',
                  2
                ]
              ]
            }}
            defs={[
              {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
              },
              {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
              }
            ]}
            fill={[
              {
                match: {
                  id: 'Utilities'
                },
                id: 'dots'
              },
              {
                match: {
                  id: 'Transportation'
                },
                id: 'lines'
              },
            ]}
          />
        )}
      </Box>
    </section>
  );
}
