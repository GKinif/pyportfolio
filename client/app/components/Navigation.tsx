import { Button, Container, Group, Header } from "@mantine/core";
import { Link, NavLink } from "remix";
import { Anchor } from "@mantine/core";
import { ReactNode } from "react";
import { CSSObject } from "@mantine/styles/lib/tss";
import { MantineTheme } from "@mantine/styles/lib/theme/types/MantineTheme";

interface LinkProps {
  children: ReactNode;
  to: string;
  sx?: CSSObject | ((theme: MantineTheme) => CSSObject);
}

const AppLink = ({ children, to, sx }: LinkProps) => {
  return (
    <Anchor
      component={NavLink}
      to={to}
      /*
      // @ts-ignore */
      className={({ isActive }) => (isActive ? "active" : "")}
      sx={{ "&.active": { color: "red" }, ...sx }}
    >
      {children}
    </Anchor>
  );
};

interface Props {
  currentUser?: string;
  onLogout: () => void;
}

export const Navigation = ({ currentUser, onLogout }: Props) => {
  return (
    <Header height={60} p="xs">
      <Container sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Anchor component={Link} to="/" sx={{ marginRight: 25 }}>
          Home
        </Anchor>

        <Group sx={{ flex: 1 }}>
          <AppLink to="/snippets">Snippets</AppLink>
        </Group>

        <Group>
          {currentUser ? (
            <Button variant="subtle" onClick={onLogout}>
              Logout
            </Button>
          ) : (
            <>
              <AppLink to="/login">Login</AppLink>
              <AppLink to="/register">Register</AppLink>
            </>
          )}
        </Group>
      </Container>
    </Header>
  );
};
