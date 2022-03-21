import {json, Link, useLoaderData} from "remix";
import {Anchor, List} from '@mantine/core';

import {getSnippets, getSnippetsResponse} from "~/services/snippet";

export const loader = async () => {
  return json(await getSnippets());
};

export default function Login() {
  return (
    <main>
      <h1>Login</h1>

    </main>
  );
}