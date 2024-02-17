import type { FC } from "react";

import { MyStreams } from "@promo-shock/templates";
import { STREAMS_PREVIEWS_MOCK } from "@promo-shock/templates/landing/mocks/fixtures";

const getData = () => {
  return STREAMS_PREVIEWS_MOCK;
};

const MyStreamsPage: FC = async () => {
  const data = await getData();
  return <MyStreams data={data} />;
};

export default MyStreamsPage;
