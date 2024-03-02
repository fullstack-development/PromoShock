"use client";
import { Tag as AntdTag } from "antd";
import classNames from "classnames";
import type { FC } from "react";

import styles from "./tag.module.scss";

type Props = {
  title: string;
  checked: boolean;
  onChange?(checked: boolean): void;
};

const Tag: FC<Props> = ({ title, checked, onChange }) => {
  return (
    <AntdTag.CheckableTag
      className={classNames(styles.root, {
        [styles.checked]: checked,
      })}
      checked={checked}
      onChange={onChange}
    >
      {title}
    </AntdTag.CheckableTag>
  );
};

export { Tag };
