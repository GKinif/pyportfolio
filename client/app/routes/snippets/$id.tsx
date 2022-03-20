import { json, useLoaderData, LoaderFunction } from "remix";
import {getSnippet, ApiSnippet, getSnippetHighlight} from "~/services/snippet";

interface Data {
  snippet: ApiSnippet;
  highlight: string;
}

export const loader: LoaderFunction = async ({ params }) => {
  const snippet = await getSnippet(params.id ?? '');
  const highlight = await getSnippetHighlight(params.id ?? '');

  return json({
    snippet, highlight
  });
};

export default function Snippet() {
  const data = useLoaderData<Data>();

  return (
    <main>
      <h1>Some Snippet: {data.snippet.title}</h1>

      <div dangerouslySetInnerHTML={{__html: data.highlight}} />
    </main>
  );
}