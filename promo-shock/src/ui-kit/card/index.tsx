"use client";
import { Card as AntdCard } from "antd";
import Image from "next/image";
import type { FC, ReactElement } from "react";

type Props = {
  image: string;
  title: string;
  description: string;
  footer?: ReactElement;
};

const Card: FC<Props> = ({ image, title, description, footer }) => {
  return (
    <AntdCard extra={footer}>
      <div>
        <Image src={image} alt={title} fill sizes="25vw" />
      </div>
      <span>{title}</span>
      <p>{description}</p>
    </AntdCard>
  );
};

export { Card };
