import { json, LoaderFunction, useLoaderData } from "remix";
import { getSession } from "~/session";
import { getCurrentUser } from "~/services/auth";

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

export default function Index() {
  const data = useLoaderData<Data>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome {data?.currentUser ? data.currentUser : "no user"}</h1>
    </div>
  );
}
