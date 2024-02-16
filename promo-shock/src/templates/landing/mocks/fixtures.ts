import dayjs from "dayjs";

import streamPreviewMock from "./stream-preview-mock.png";

export const STREAMS_PREVIEWS_MOCK = [
  {
    preview: streamPreviewMock.src,
    cost: 99,
    date: dayjs("15-07-2025", "DD-MM-YYYY"),
    title: "Study with the HARVARD STUDY",
    description: "For the first time in three years, Felix ‘xQc’ Lengye.",
    ticketsTotal: 50,
    ticketsLeft: 1,
  },
  {
    preview: streamPreviewMock.src,
    cost: 999999,
    date: dayjs("15-07-2025", "DD-MM-YYYY"),
    title: "Study with the HARVARD STUDY",
    description:
      "For the first time in three years, Felix ‘xQc’ Lengyel is not the most-watched streamer on Twitch.",
    ticketsTotal: 50,
    ticketsLeft: 0,
  },
  {
    preview: streamPreviewMock.src,
    cost: 10,
    date: dayjs("15-07-1999", "DD-MM-YYYY"),
    title: "Study with the HARVARD STUDY",
    description:
      "For the first time in three years, Felix ‘xQc’ Lengyel is not the most-watched streamer on Twitch, as new streamers rise up to the top of the pile.",
    ticketsTotal: 50,
    ticketsLeft: 49,
  },
];
