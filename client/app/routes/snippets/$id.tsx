import { json, useLoaderData, LoaderFunction } from "remix";
import {
  getSnippet,
  ApiSnippet,
  getSnippetHighlight,
} from "~/services/snippet";
import { Paper, Title } from "@mantine/core";

interface Data {
  snippet: ApiSnippet;
  highlight: string;
}

export const loader: LoaderFunction = async ({ params }) => {
  const snippet = await getSnippet(params.id ?? "");
  const highlight = await getSnippetHighlight(params.id ?? "");

  return json({
    snippet: snippet.data,
    highlight: highlight.data,
  });
};

export default function Snippet() {
  const data = useLoaderData<Data>();

  return (
    <main>
      <Title order={1}>{data.snippet.title}</Title>

      <Paper
        shadow="sm"
        radius="md"
        p="md"
        withBorder
        dangerouslySetInnerHTML={{ __html: data.highlight }}
      />
    </main>
  );
}
