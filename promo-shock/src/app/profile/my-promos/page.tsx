import type { FC } from "react";

import { MyPromos } from "@promo-shock/templates";
import { PROMOS_LIST_MOCK } from "@promo-shock/templates/promos/mocks/fixtures";

const getData = () => {
  return PROMOS_LIST_MOCK;
};

const MyPromosPage: FC = async () => {
  const data = await getData();
  return <MyPromos data={data} />;
};

export default MyPromosPage;
