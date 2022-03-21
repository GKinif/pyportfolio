import {json, Link, useLoaderData} from "remix";
import {Anchor, List} from '@mantine/core';

import {getSnippets, getSnippetsResponse} from "~/services/snippet";

export const loader = async () => {
  return json(await getSnippets());
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