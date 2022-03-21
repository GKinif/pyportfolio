import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type {MetaFunction} from "remix";
import {AppShell, MantineProvider} from '@mantine/core';
import {Navigation} from "~/components/Navigation";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <html lang="en">
    <head>
      <Meta/>
      <Links/>
    </head>
    <body>
    <MantineProvider withNormalizeCSS withGlobalStyles>
      <AppShell
        padding="lg"
        header={<Navigation/>}
      >
        <Outlet/>
      </AppShell>
    </MantineProvider>

    <ScrollRestoration/>
    <Scripts/>
    <LiveReload/>
    </body>
    </html>
  );
}
