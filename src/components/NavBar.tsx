import { useState } from "react";
import {
  Container,
  Group,
  Burger,
  Paper,
  Transition,
  Text,
  AppShell,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/router";

import classes from "./NavBar.module.css";

interface HeaderResponsiveProps {
  links: { link: string; label: string }[];
}

export function NavBar({ links }: HeaderResponsiveProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const router = useRouter();

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
      data-active={router.pathname === link.link || undefined}
      onClick={toggle}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <Container size="md" className={classes.inner}>
        <Text fz="xl">Food Organizer</Text>
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper className={classes.dropdown} withBorder style={styles}>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </header>
  );
}
