import {
  ActionFunction,
  json,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useSubmit,
} from "remix";
import type { MetaFunction } from "remix";
import { AppShell, Container, MantineProvider } from "@mantine/core";
import { Navigation } from "~/components/Navigation";
import { destroySession, getSession } from "~/session";
import { getCurrentUser, postLogout } from "~/services/auth";
import { useCallback } from "react";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

interface Data {
  currentUser?: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userToken")) {
    try {
      const userResponse = await getCurrentUser();
      return json({ currentUser: userResponse.data.email });
    } catch (error) {
      return null;
    }
  }
  return null;
};

export default function App() {
  const submit = useSubmit();
  const data = useLoaderData<Data>();

  const handleLogoutClick = useCallback(() => {
    submit(null, { method: "post", action: "/logout" });
  }, []);
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <MantineProvider withNormalizeCSS withGlobalStyles>
          <AppShell
            padding="lg"
            header={
              <Navigation
                currentUser={data?.currentUser}
                onLogout={handleLogoutClick}
              />
            }
          >
            <Container>
              <Outlet />
            </Container>
          </AppShell>
        </MantineProvider>

        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
