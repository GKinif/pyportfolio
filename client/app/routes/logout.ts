import type { ActionFunction } from "remix";
import { destroySession, getSession } from "~/session";
import { postLogout } from "~/services/auth";
import { json, redirect } from "remix";
import { removeAuthToken } from "~/services/axiosInstance";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  try {
    removeAuthToken();
    const response = await postLogout();

    console.log("response: ", response.data);

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
      return json({ errors: error.response?.data });
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      return json({
        errors: ["Unable to reach server"],
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return json({
        errors: ["Unexpected errors"],
      });
    }
  }
};
