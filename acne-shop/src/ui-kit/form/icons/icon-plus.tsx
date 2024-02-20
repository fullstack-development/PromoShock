import type { FC } from "react";

import type { PropsWithClassName } from "@acne-shop/shared/types";

const IconPlus: FC<PropsWithClassName> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      className={className}
      fill="none"
      viewBox="0 0 14 15"
    >
      <path
        fill="currentColor"
        d="M7.468 1.932h-.937c-.083 0-.125.041-.125.125v4.906H1.75c-.083 0-.125.042-.125.125v.937c0 .084.042.125.125.125h4.656v4.907c0 .083.042.125.125.125h.937c.084 0 .125-.042.125-.125V8.15h4.657c.083 0 .125-.041.125-.125v-.937c0-.083-.042-.125-.125-.125H7.593V2.057c0-.084-.041-.125-.125-.125Z"
      />
    </svg>
  );
};

export { IconPlus };
