import type { FC } from "react";

import { Header } from "./header";

type Props = {
  gutterBottom?: boolean;
};

const Footer: FC<Props> = ({ gutterBottom }) => {
  return <Header gutterBottom={gutterBottom} isMirror />;
};

export { Footer };
