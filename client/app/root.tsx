import {
  json,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useSubmit,
} from "remix";
import type { MetaFunction } from "remix";
import { AppShell, Container, MantineProvider } from "@mantine/core";
import { Navigation } from "~/components/Navigation";
import { commitSession, getSession } from "~/session";
import { getCurrentUser } from "~/services/auth";
import { useCallback } from "react";
import { Notification } from "~/components/Notification";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

interface Data {
  currentUser?: string;
  notification?: {
    severity: "error" | "warning" | "info" | "success";
    title: string;
    message: string;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const sessionNotification = session.get("notification");

  const data = {
    notification: sessionNotification ? JSON.parse(sessionNotification) : null,
  };

  if (session.has("userToken")) {
    try {
      const userResponse = await getCurrentUser();
      return json(
        { ...data, currentUser: userResponse.data.email },
        {
          headers: {
            // only necessary with cookieSessionStorage
            "Set-Cookie": await commitSession(session),
          },
        }
      );
    } catch (error) {
      return json(data, {
        headers: {
          // only necessary with cookieSessionStorage
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  }
  return json(data, {
    headers: {
      // only necessary with cookieSessionStorage
      "Set-Cookie": await commitSession(session),
    },
  });
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
            {data.notification ? (
              <Notification
                severity={data.notification.severity}
                title={data.notification.title}
                message={data.notification.message}
              />
            ) : null}
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
