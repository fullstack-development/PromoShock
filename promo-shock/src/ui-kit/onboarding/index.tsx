import { Tour } from "antd";
import type { FC, ReactNode } from "react";

import styles from "./onboarding.module.scss";

type Props = {
  open?: boolean;
  steps: Array<{
    title: ReactNode;
    description?: ReactNode;
    cover?: ReactNode;
    target?: HTMLElement | (() => HTMLElement) | null | (() => null);
  }>;
  onClose: () => void;
  onFinish: () => void;
};

const Onboarding: FC<Props> = ({ steps, open, onClose, onFinish }) => {
  return (
    <Tour
      open={open}
      steps={steps}
      onClose={onClose}
      onFinish={onFinish}
      rootClassName={styles.root}
      disabledInteraction
    />
  );
};

export { Onboarding };
