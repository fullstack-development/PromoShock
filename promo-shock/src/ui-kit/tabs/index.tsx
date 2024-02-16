"use client";
import cn from "classnames";
import type { FC } from "react";

import styles from "./tabs.module.scss";

type Props = {
  tabList: { label: string }[];
  selected: number;
  setSelected: (value: number) => void;
};

export const TabList: FC<Props> = ({ tabList, selected, setSelected }) => (
  <ul className={styles.root}>
    {tabList.map(({ label }, index) => (
      <li
        key={label}
        className={cn(styles.tab, {
          [styles.tab_active]: selected === index,
        })}
        onClick={() => setSelected(index)}
      >
        {label}
      </li>
    ))}
  </ul>
);
