"use client";
import classNames from "classnames";
import type { StaticImageData } from "next/image";
import Image from "next/image";
import type { FC } from "react";

import type { PropsWithClassName } from "@promo-shock/shared/types";
import { TextLink } from "@promo-shock/ui-kit";

import styles from "./team-member.module.scss";

type Props = {
  image: StaticImageData | string;
  title: string;
  description: string;
  link: { title: string; href: string };
};

export const TeamMember: FC<PropsWithClassName<Props>> = ({
  image,
  title,
  description,
  link,
  className,
}) => {
  return (
    <div className={classNames(styles.root, className)}>
      <Image
        className={styles.image}
        width={360}
        height={255}
        src={image}
        alt="stream preview"
      />

      <div className={styles.info}>
        <h5 className={styles.title}>{title}</h5>
        <p className={styles.description}>{description}</p>
        <TextLink className={styles.link} {...link} underline external />
      </div>
    </div>
  );
};
