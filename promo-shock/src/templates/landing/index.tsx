"use client";

import Image from "next/image";
import { useState } from "react";
import type { FC } from "react";

import {
  Button,
  Marquee,
  StreamCard,
  TabList,
  TextLink,
} from "@promo-shock/ui-kit";

import { DoubleTriangle } from "./img/DoubleTriangle";
import backgroundIcons from "./img/icons.svg";
import { Star } from "./img/Star";
import styles from "./landing.module.scss";
import { STREAMS_PREVIEWS_MOCK } from "./mocks/fixtures";

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

export const Landing: FC = () => {
  const [selected, setSelected] = useState(0);

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
        <TabList
          selected={selected}
          setSelected={setSelected}
          tabList={promoTabs}
        />
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
            <Marquee
              direction="left"
              text={
                <>
                  <Star />
                  Upcoming Shows
                  <Star />
                  Upcoming Shows
                </>
              }
            />
          </div>
        </div>

        <div className={styles.previewsContainer}>
          <TextLink
            title="See all shows"
            underline
            href="/CHANGE_ME"
            className={styles.seeAllShowsLink}
          />
        </div>

        <div className={styles.previewsContainer}>
          {STREAMS_PREVIEWS_MOCK.map((options) => (
            <StreamCard
              key={`${options.title}${options.description}`}
              {...options}
            />
          ))}
        </div>

        <div className={styles.ticker} style={{ top: "calc(100% - 80px)" }}>
          <div className={styles.tickerLine}>
            <Marquee
              direction="right"
              text={
                <>
                  <Star />
                  Upcoming Shows
                  <Star />
                  Upcoming Shows
                </>
              }
            />
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
