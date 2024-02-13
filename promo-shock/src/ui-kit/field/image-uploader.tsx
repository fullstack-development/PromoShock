"use client";
import { Upload } from "antd";
import type { UploadFile } from "antd";
import type { UploadProps, UploadRef } from "antd/es/upload/Upload";
import type { FC, Ref } from "react";
import { forwardRef } from "react";

type Props = {
  value?: UploadFile;
  defaultValue?: UploadFile;
  placeholder?: string;
  onChange?(value: UploadFile): void;
};

const ImageUploader: FC<Props> = forwardRef(
  ({ value, defaultValue, placeholder, onChange }, ref?: Ref<UploadRef>) => {
    const handleChange: UploadProps["onChange"] = ({ file }) => {
      onChange?.(file);
    };

    return (
      <Upload
        ref={ref}
        fileList={value && [value]}
        defaultFileList={defaultValue && [defaultValue]}
        onChange={handleChange}
      >
        {placeholder}
      </Upload>
    );
  },
);

export { ImageUploader };
