import { useMemo } from "react";

const useCreateObjectUrl = (file: null | File) => {
  return useMemo(() => (file ? URL.createObjectURL(file) : undefined), [file]);
};

export { useCreateObjectUrl };
