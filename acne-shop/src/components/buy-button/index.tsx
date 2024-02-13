"use client";
import type { ComponentProps, FC } from "react";

import { Button } from "@acne-shop/ui-kit";

type Props = {
  productId: string;
} & Pick<ComponentProps<typeof Button>, "size" | "theme">;

const BuyButton: FC<Props> = ({ ...props }) => {
  return <Button text="Buy now" {...props} />;
};

export { BuyButton };
