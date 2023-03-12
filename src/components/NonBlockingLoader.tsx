import { Affix, Loader } from "@mantine/core";

export function NonBlockingLoader() {
  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Loader />
    </Affix>
  );
}
