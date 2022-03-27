import { Box, Container, Group, Header } from "@mantine/core";
import { Link, NavLink } from "remix";
import { Anchor } from "@mantine/core";
import { ReactNode } from "react";
import { CSSObject } from "@mantine/styles/lib/tss";
import { MantineTheme } from "@mantine/styles/lib/theme/types/MantineTheme";
import { selectCurrentUser, useUserStore } from "~/store/useStore";

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

export const Navigation = () => {
  const currentUser = useUserStore(selectCurrentUser);
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
            <AppLink to="/login">Logout</AppLink>
          ) : (
            <AppLink to="/login">Login</AppLink>
          )}
        </Group>
      </Container>
    </Header>
  );
};
