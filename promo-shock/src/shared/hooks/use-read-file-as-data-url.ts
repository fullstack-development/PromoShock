import { useEffect, useState } from "react";

import { readFileAsDataURL } from "../utils";

const useReadFileAsDataURL = (file: File | null = null) => {
  const [imageBase64, setImageBase64] = useState<string>();

  useEffect(() => {
    let canceled = false;

    (async () => {
      const base64 = file && (await readFileAsDataURL(file));

      if (!canceled) setImageBase64(base64 || undefined);
    })();

    return () => {
      canceled = true;
    };
  }, [file]);

  return imageBase64;
};

export { useReadFileAsDataURL };
