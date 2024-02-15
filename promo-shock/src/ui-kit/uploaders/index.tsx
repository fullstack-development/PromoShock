"use client";
import { Upload } from "antd";
import type { UploadFile } from "antd";
import type { UploadProps, UploadRef } from "antd/es/upload/Upload";
import classNames from "classnames";
import Image from "next/image";
import type { FC, Ref } from "react";
import { forwardRef } from "react";

import { useReadFileAsDataURL } from "@promo-shock/shared/hooks";
import type { PropsWithClassName } from "@promo-shock/shared/types";

import classes from "./uploader.module.scss";
import { IconPlus } from "../icons";

type Props = {
  value?: UploadFile;
  accept?: `image/${string}`;
  defaultValue?: UploadFile;
  placeholder?: string;
  aspectRatio?: `${number}/${number}`;
  max?: number;
  width?: number;
  height?: number;
  onChange?(value: UploadFile): void;
};

const ImageUploader: FC<PropsWithClassName<Props>> = forwardRef(
  (
    {
      value,
      accept = "image/*",
      aspectRatio = "1/1",
      defaultValue,
      placeholder,
      className,
      onChange,
    },
    ref?: Ref<UploadRef>,
  ) => {
    const imageDataUrl = useReadFileAsDataURL(value?.originFileObj);
    const handleChange: UploadProps["onChange"] = ({ file }) => {
      onChange?.(file);
    };

    return (
      <div
        style={{ aspectRatio }}
        className={classNames(className, classes.root)}
      >
        <Upload
          ref={ref}
          accept={accept}
          listType="picture-card"
          showUploadList={false}
          fileList={value && [value]}
          customRequest={() => void 0}
          defaultFileList={defaultValue && [defaultValue]}
          onChange={handleChange}
          rootClassName={classes.input}
        >
          {imageDataUrl ? (
            <Image
              className={classes.image}
              src={imageDataUrl}
              alt={value?.name || "Uploaded image"}
              fill
            />
          ) : (
            <span className={classes.placeholder}>
              <IconPlus className={classes.placeholder_icon} />
              <span className={classes.placeholder_text}>{placeholder}</span>
            </span>
          )}
        </Upload>
      </div>
    );
  },
);

export { ImageUploader };
