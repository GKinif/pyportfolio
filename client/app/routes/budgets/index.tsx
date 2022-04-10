import { json, Link, redirect, useLoaderData } from "remix";
import { Anchor, List } from "@mantine/core";

import { getBudgets, getBudgetsResponse } from "~/services/budgets";

export const loader = async () => {
  try {
    const response = await getBudgets();
    return json(response.data);
  } catch (error: any) {
    if (error.response?.status === 401) {
      return redirect("/login?backTo=/budgets");
    }
    return redirect("/");
  }
};

export default function Budgets() {
  const budgets = useLoaderData<getBudgetsResponse>();

  return (
    <main>
      <h1>Budgets</h1>

      <List listStyleType="none">
        {budgets.results.map((budget) => (
          <List.Item key={budget.id}>
            <Anchor component={Link} to={`${budget.id}`}>
              {budget.title}
            </Anchor>
          </List.Item>
        ))}
      </List>
    </main>
  );
}
