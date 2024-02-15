"use client";

import dayjs from "dayjs";
import Image from "next/image";
import type { FC } from "react";

import { Button, Link, StreamCard, useTabs } from "@promo-shock/ui-kit";

import { DoubleTriangle } from "./img/DoubleTriangle";
import backgroundIcons from "./img/icons.svg";
import { Star } from "./img/Star";
import streamPreview from "./img/stream-preview.png";
import styles from "./landing.module.scss";

const promoTabs = [
  {
    label: "watchers",
    panel: [
      "Unlock the VIP streams",
      "Watch your fav streamers",
      "Score sweet deals from brands",
    ],
  },
  {
    label: "streamers",
    panel: [
      "Whip up a pass for stream",
      "Spread it to your watchers",
      "Score a wave of new fans",
    ],
  },
  {
    label: "brands",
    panel: [
      "Pick the juiciest TA",
      "Whip up a promo",
      "Watch the sales go bananas!",
    ],
  },
];

const streamsPreviews = [
  {
    preview: streamPreview.src,
    cost: 99,
    date: dayjs("15-07-2025", "DD-MM-YYYY"),
    title: "Study with the HARVARD STUDY",
    description: "For the first time in three years, Felix ‘xQc’ Lengye.",
    ticketsTotal: 50,
    ticketsLeft: 1,
  },
  {
    preview: streamPreview.src,
    cost: 999999,
    date: dayjs("15-07-2025", "DD-MM-YYYY"),
    title: "Study with the HARVARD STUDY",
    description:
      "For the first time in three years, Felix ‘xQc’ Lengyel is not the most-watched streamer on Twitch.",
    ticketsTotal: 50,
    ticketsLeft: 0,
  },
  {
    preview: streamPreview.src,
    cost: 10,
    date: dayjs("15-07-1999", "DD-MM-YYYY"),
    title: "Study with the HARVARD STUDY",
    description:
      "For the first time in three years, Felix ‘xQc’ Lengyel is not the most-watched streamer on Twitch, as new streamers rise up to the top of the pile.",
    ticketsTotal: 50,
    ticketsLeft: 49,
  },
];

export const Landing: FC = () => {
  const { selected, TabList } = useTabs(promoTabs);
  return (
    <main className={styles.root}>
      <Image
        className={styles.backgroundIcons}
        width={1250}
        height={546}
        src={backgroundIcons.src}
        alt="background icons"
      />
      <h1 className={styles.title}>Streams with benefits for...</h1>

      <div className={styles.tabs}>
        <TabList />
        <div className={styles.panels}>
          <span className={styles.panel}>{promoTabs[selected].panel[0]}</span>
          <DoubleTriangle />
          <span className={styles.middlePanel}>
            {promoTabs[selected].panel[1]}
          </span>
          <DoubleTriangle />
          <span className={styles.panel}>{promoTabs[selected].panel[2]}</span>
        </div>
        <Button theme="secondary" size="largeWide" text="I wanna try" />
      </div>

      <div className={styles.upcoming}>
        <div className={styles.ticker}>
          <div className={styles.tickerLine}>
            <Star />
            Upcoming Shows
            <Star />
            Upcoming Shows
            <Star />
            Upcoming Shows
            <Star />
          </div>
        </div>

        <div className={styles.previewsContainer}>
          <Link underline href="/CHANGE_ME" className={styles.seeAllShowsLink}>
            See all shows
          </Link>
        </div>

        <div className={styles.previewsContainer}>
          {streamsPreviews.map((options) => (
            <StreamCard
              key={`${options.title}${options.description}`}
              {...options}
            />
          ))}
        </div>

        <div className={styles.ticker} style={{ top: "calc(100% - 80px)" }}>
          <div className={styles.tickerLine}>
            <Star />
            Upcoming Shows
            <Star />
            Upcoming Shows
            <Star />
            Upcoming Shows
            <Star />
          </div>
        </div>
      </div>

      <h2 className={styles.title} style={{ paddingTop: 96 }}>
        Start easily
      </h2>

      <div className={styles.tabs}>
        <div className={styles.panels}>
          <span className={styles.panel}>{promoTabs[selected].panel[0]}</span>
          <DoubleTriangle />
          <span className={styles.middlePanel}>
            {promoTabs[selected].panel[1]}
          </span>
          <DoubleTriangle />
          <span className={styles.panel}>{promoTabs[selected].panel[2]}</span>
        </div>
        <Button theme="secondary" size="largeWide" text="I wanna try" />
      </div>
    </main>
  );
};
