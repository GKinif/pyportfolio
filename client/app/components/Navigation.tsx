import {Header} from "@mantine/core";
import {Link, NavLink} from "remix";
import {Anchor} from '@mantine/core';
import {ReactNode} from "react";
import {CSSObject} from "@mantine/styles/lib/tss";
import {MantineTheme} from "@mantine/styles/lib/theme/types/MantineTheme";

interface LinkProps {
  children: ReactNode;
  to: string;
  sx?: CSSObject | ((theme: MantineTheme) => CSSObject)
}

const AppLink = ({children, to, sx}: LinkProps) => {
  return (
    <Anchor
      component={NavLink}
      to={to}
      /*
      // @ts-ignore */
      className={({isActive}) => isActive ? 'active' : ''}
      sx={{'&.active': {color: 'red'}, ...sx}}
    >
      {children}
    </Anchor>
  )
}

export const Navigation = () => {
  return (
    <Header height={60} p="xs" sx={{display: 'flex', alignItems: 'center'}}>
      <Anchor component={Link} to="/" sx={{marginRight: 25}}>
        Home
      </Anchor>

      <AppLink to="/snippets">
        Snippets
      </AppLink>
    </Header>
  )
}