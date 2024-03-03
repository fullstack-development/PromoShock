import { useKeyPress } from "react-use";

const useCmdCtrlPressed = () => {
  const [pressed] = useKeyPress((event) => event.metaKey || event.ctrlKey);
  return pressed;
};

export { useCmdCtrlPressed };
