import { Tour } from "antd";
import type { FC, ReactNode } from "react";

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
      disabledInteraction
    />
  );
};

export { Onboarding };
