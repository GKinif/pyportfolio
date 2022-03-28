import { json, Link, redirect, useLoaderData } from "remix";
import { Anchor, List } from "@mantine/core";

import { getSnippets, getSnippetsResponse } from "~/services/snippet";

export const loader = async () => {
  try {
    const response = await getSnippets();
    return json(response.data);
  } catch (error: any) {
    if (error.response.status === 401) {
      return redirect("/login?backTo=/snippets");
    }
    return redirect("/");
  }
};

export default function Snippets() {
  const snippets = useLoaderData<getSnippetsResponse>();

  return (
    <main>
      <h1>Snippets</h1>

      <List listStyleType="none">
        {snippets.results.map((snippet) => (
          <List.Item key={snippet.id}>
            <Anchor component={Link} to={`${snippet.id}`}>
              {snippet.title}
            </Anchor>
          </List.Item>
        ))}
      </List>
    </main>
  );
}
