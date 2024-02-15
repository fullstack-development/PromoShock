"use client";

import cn from "classnames";
import { useState } from "react";

import styles from "./tabs.module.scss";

export const useTabs = (tabList: { label: string }[]) => {
  const [selected, setSelected] = useState(0);

  const TabList = () => (
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

  return { selected, TabList };
};
