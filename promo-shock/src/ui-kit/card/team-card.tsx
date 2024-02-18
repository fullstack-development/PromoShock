import Image from "next/image";
import type { FC } from "react";

import styles from "./streamCard.module.scss";

type Props = {
  preview: string;
  title: string;
  description: string;
};

export const TeamCard: FC<Props> = ({ preview, title, description }) => {
  return (
    <div className={styles.root}>
      <Image
        className={styles.image}
        width={360}
        height={255}
        src={preview}
        alt="stream preview"
      />

      <div className={styles.description} style={{ height: 170 }}>
        <h5
          className={styles.title}
          style={{ fontSize: 24, paddingBottom: 20 }}
        >
          {title}
        </h5>
        <p style={{ fontSize: 20, lineHeight: "32px" }}>{description}</p>
      </div>
    </div>
  );
};
