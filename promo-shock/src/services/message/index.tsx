"use client";
import { message } from "antd";
import classNames from "classnames";
import type { FC, PropsWithChildren } from "react";
import { createContext, useContext } from "react";

import styles from "./message.module.scss";

const MessageContext = createContext<{
  success: (str: string) => void;
  error: (str: string) => void;
  info: (str: string) => void;
  warning: (str: string) => void;
}>({
  success: () => {},
  error: () => {},
  info: () => {},
  warning: () => {},
});

const MessageProvider: FC<PropsWithChildren> = ({ children }) => {
  const [messageApi, messageElement] = message.useMessage();

  const messageApiWithStyle = {
    success: (str: string) =>
      messageApi.success({
        icon: null,
        className: classNames(styles.root, styles.root_success),
        content: str,
      }),
    error: (str: string) =>
      messageApi.error({
        icon: null,
        className: classNames(styles.root, styles.root_error),
        content: str,
      }),
    info: (str: string) =>
      messageApi.info({
        icon: null,
        className: classNames(styles.root, styles.root_info),
        content: str,
      }),
    warning: (str: string) =>
      messageApi.warning({
        icon: null,
        className: classNames(styles.root, styles.root_warning),
        content: str,
      }),
  };

  return (
    <MessageContext.Provider value={messageApiWithStyle}>
      {messageElement}
      {children}
    </MessageContext.Provider>
  );
};

const useMessage = () => {
  const messageApi = useContext(MessageContext);
  return messageApi;
};

const useErrorMessage = () => useMessage().error;
const useSuccessMessage = () => useMessage().success;
const useInfoMessage = () => useMessage().info;
const useWarningMessage = () => useMessage().warning;

export {
  useMessage,
  useErrorMessage,
  useSuccessMessage,
  useInfoMessage,
  useWarningMessage,
  MessageProvider,
};
