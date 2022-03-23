import {
  ActionFunction,
  redirect,
  Form,
  json,
  useActionData,
  useTransition,
} from "remix";
import {
  Button,
  Paper,
  PasswordInput,
  TextInput,
  LoadingOverlay,
  Group,
  Text,
} from "@mantine/core";
import { postLogin } from "~/services/auth";
import { setAuthToken } from "~/services/axiosInstance";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email") ?? "";
  const password = formData.get("password") ?? "";
  // const values = Object.fromEntries(formData);

  const errors: Record<string, string> = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";

  if (Object.keys(errors).length) {
    return json({ errors, values: { email } });
  }

  try {
    const response = await postLogin({ email, password } as any);
    setAuthToken(response.data.auth_token);
    return redirect("/");
  } catch (error: any) {
    return json({ errors: error.response.data, values: { email } });
  }
};

export default function Login() {
  // when the form is being processed on the server, this returns different
  // transition states to help us build pending and optimistic UI.
  const transition = useTransition();
  const actionData = useActionData();

  return (
    <main>
      <h1>Login</h1>

      <Paper sx={{ position: "relative" }}>
        <LoadingOverlay visible={transition.state === "submitting"} />
        <Form method="post">
          <TextInput
            name="email"
            placeholder="youremail@email.com"
            label="Email"
            type="email"
            error={actionData?.errors?.email}
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
            error={actionData?.errors?.password}
            required
            sx={{ paddingBottom: 25 }}
          />

          <Group>
            <Button
              type="submit"
              variant="outline"
              disabled={transition.state === "submitting"}
            >
              {transition.state === "submitting" ? "Submitting..." : "Submit"}
            </Button>

            {actionData?.errors?.non_field_errors.length > 0 ? (
              <Text color="red">{actionData?.errors?.non_field_errors[0]}</Text>
            ) : null}
          </Group>
        </Form>
      </Paper>
    </main>
  );
}
