import type { FC, PropsWithChildren } from "react";

import styles from "./card-list.module.scss";

export const CardList: FC<PropsWithChildren> = ({ children }) => (
  <div className={styles.previewList}>{children}</div>
);
