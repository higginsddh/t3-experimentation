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

const HEADER_HEIGHT = 60;

// const useStyles = createStyles((theme) => ({
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     height: "100%",
//   },

//   links: {
//     [theme.fn.smallerThan("sm")]: {
//       display: "none",
//     },
//   },

//   burger: {
//     [theme.fn.largerThan("sm")]: {
//       display: "none",
//     },
//   },

//   link: {
//     display: "block",
//     lineHeight: 1,
//     padding: "8px 12px",
//     borderRadius: theme.radius.sm,
//     textDecoration: "none",
//     color:
//       theme.colorScheme === "dark"
//         ? theme.colors.dark[0]
//         : theme.colors.gray[7],
//     fontSize: theme.fontSizes.sm,
//     fontWeight: 500,

//     "&:hover": {
//       backgroundColor:
//         theme.colorScheme === "dark"
//           ? theme.colors.dark[6]
//           : theme.colors.gray[0],
//     },

//     [theme.fn.smallerThan("sm")]: {
//       borderRadius: 0,
//       padding: theme.spacing.md,
//     },
//   },

//   linkActive: {
//     "&, &:hover": {
//       backgroundColor: theme.fn.variant({
//         variant: "light",
//         color: theme.primaryColor,
//       }).background,
//       color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
//         .color,
//     },
//   },
// }));

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
      // className={cx(classes.link, {
      //   [classes.linkActive]: router.pathname === link.link,
      // })}
      onClick={toggle}
    >
      {link.label}
    </Link>
  ));

  return (
    <AppShell.Header mb={20} className={"root"}>
      <Container className={"header"}>
        <Text fz="xl">Food Organizer</Text>
        <Group gap="lg" className={"links"} visibleFrom="md">
          {items}
        </Group>
        <Burger
          opened={opened}
          onClick={toggle}
          className={"burger"}
          size="sm"
          hiddenFrom="md"
        />
        <Transition transition="pop-top-right" duration={200} mounted={opened}>
          {(styles) => (
            <Paper
              className={"dropdown"}
              hiddenFrom="md"
              withBorder
              style={styles}
            >
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </AppShell.Header>
  );
}
