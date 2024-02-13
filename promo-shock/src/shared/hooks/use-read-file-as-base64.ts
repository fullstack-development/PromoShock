import { useEffect, useState } from "react";

const readFileAsDataURL = (file: File) => {
  const reader = new FileReader();

  const dataURL = new Promise<string>((res, rej) => {
    reader.onload = () => {
      if (typeof reader.result === "string") {
        res(reader.result);
      } else {
        rej("result is not base64 string");
      }
    };
    reader.onerror = () => rej(reader.error);
  });

  reader.readAsDataURL(file);

  return dataURL;
};

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
