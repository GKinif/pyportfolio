import {
  ActionFunction,
  Form,
  json,
  useActionData,
  useTransition,
  redirect,
  LoaderFunction,
} from "remix";
import { commitSession, getSession } from "../session";
import {
  Button,
  Paper,
  PasswordInput,
  TextInput,
  LoadingOverlay,
  Group,
  Text,
} from "@mantine/core";
import { createUser, CreateUserData } from "~/services/auth";
import { removeAuthToken, setAuthToken } from "~/services/axiosInstance";
import { object, string, ZodError } from "zod";
import { createNotification } from "~/components/Notification";

const registerSchema = object({
  email: string().email().min(5),
  password: string().min(5),
});

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  const formData = await request.formData();
  const values = Object.fromEntries(formData);

  try {
    registerSchema.parse(values);
  } catch (error) {
    if (error instanceof ZodError) {
      const formErrors: any = error.flatten();
      return json({ errors: formErrors, values: { email: values.email } });
    }
    return json({
      errors: { non_field_errors: ["Unexpected errors"] },
      values: { email: values.email },
    });
  }

  try {
    await createUser(values as unknown as CreateUserData);

    createNotification(session, {
      severity: "info", // error | warning | info | success
      title: "Congratulation",
      message: "You can login with your credentials",
    });

    // Login succeeded, send them to the home page.
    return redirect("/login", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error: any) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return json({
        errors: error.response?.data,
        values: { email: values.email },
      });
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      return json({
        errors: { non_field_errors: ["Unable to reach server"] },
        values: { email: values.email },
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      return json({
        errors: { non_field_errors: ["Unexpected errors"] },
        values: { email: values.email },
      });
    }
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userToken")) {
    // Redirect to the home page if they are already signed in.
    setAuthToken(session.get("userToken"));
    return redirect("/");
  }
  removeAuthToken();
  return null;
};

export default function Login() {
  // when the form is being processed on the server, this returns different
  // transition states to help us build pending and optimistic UI.
  const transition = useTransition();
  const actionData = useActionData();
  const loading = transition.state === "submitting";

  return (
    <main>
      <h1>Register</h1>

      <Paper sx={{ position: "relative" }}>
        <LoadingOverlay visible={loading} />
        <Form method="post">
          <TextInput
            name="email"
            placeholder="youremail@email.com"
            label="Email"
            type="email"
            error={
              actionData?.errors?.fieldErrors?.email ??
              actionData?.errors?.email
            }
            defaultValue={actionData?.values?.email}
            disabled={transition.state === "submitting"}
            required
            sx={{ paddingBottom: 25 }}
          />

          <PasswordInput
            name="password"
            placeholder="Password"
            label="Password"
            disabled={transition.state === "submitting"}
            error={
              actionData?.errors?.fieldErrors?.password ??
              actionData?.errors?.password
            }
            required
            sx={{ paddingBottom: 25 }}
          />

          <Group>
            <Button type="submit" variant="outline" disabled={loading}>
              {transition.state === "submitting" ? "Submitting..." : "Submit"}
            </Button>

            {actionData?.errors?.non_field_errors?.length > 0 ? (
              <Text color="red">{actionData?.errors?.non_field_errors[0]}</Text>
            ) : null}

            {actionData?.errors?.detail ? (
              <Text color="red">{actionData?.errors.detail}</Text>
            ) : null}
          </Group>
        </Form>
      </Paper>
    </main>
  );
}
