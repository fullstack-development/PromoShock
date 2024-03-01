import { message } from "antd";
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
      messageApi.success({ className: styles.root, content: str }),
    error: (str: string) =>
      messageApi.error({ className: styles.root, content: str }),
    info: (str: string) =>
      messageApi.info({ className: styles.root, content: str }),
    warning: (str: string) =>
      messageApi.warning({ className: styles.root, content: str }),
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
