"use client";
import type { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import type { FC } from "react";

import { Button, Card } from "@promo-shock/ui-kit";

type Props = {
  address: string;
  banner: string;
  title: string;
  description: string;
  date: Dayjs;
  price: number;
};

const StreamCard: FC<Props> = ({ address, date, price, banner, ...rest }) => {
  const router = useRouter();

  const handleBuyAccess = () => {
    router.push(`/stream/${address}`);
  };

  return (
    <Card
      image={banner}
      footer={
        <div>
          <span>{date.toString()}</span>
          <span>{price} USDT</span>
          <Button text="Buy access" size="medium" onClick={handleBuyAccess} />
        </div>
      }
      {...rest}
    />
  );
};

export { StreamCard };
