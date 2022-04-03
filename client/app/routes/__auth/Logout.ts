import type { ActionFunction } from "remix";
import { commitSession, destroySession, getSession } from "~/session";
import { postLogout } from "~/services/auth";
import { redirect } from "remix";
import { removeAuthToken } from "~/services/axiosInstance";
import { createNotification } from "~/components/Notification";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  try {
    removeAuthToken();
    await postLogout();

    // Login succeeded, send them to the home page.
    return redirect("/", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      createNotification(session, {
        severity: "error",
        title: "Error",
        message: "Unable to logout",
      });
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      createNotification(session, {
        severity: "error",
        title: "Error",
        message: "Unable to reach server",
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      createNotification(session, {
        severity: "error",
        title: "Error",
        message: "Unexpected errors",
      });
    }
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
};
