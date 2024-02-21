"use client";
import Image from "next/image";
import { useState } from "react";
import type { FC } from "react";

import type { UnwrapPromise } from "@promo-shock/shared/types";
import {
  Button,
  Marquee,
  StreamCard,
  TabList,
  TextLink,
} from "@promo-shock/ui-kit";

import { promoTabs } from "./constants";
import { DoubleTriangle } from "./img/DoubleTriangle";
import backgroundIcons from "./img/icons.svg";
import { Star } from "./img/Star";
import styles from "./landing.module.scss";
import type { fetchStreamCards } from "../queries";

type Props = {
  streams: UnwrapPromise<ReturnType<typeof fetchStreamCards>>;
};

export const Landing: FC<Props> = ({ streams }) => {
  const [selected, setSelected] = useState(0);

  const handleSelect = (index: number) => {
    setSelected(index);
  };

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
          setSelected={handleSelect}
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
        <Button
          theme="secondary"
          size="largeWide"
          text={promoTabs[selected].button}
          href={promoTabs[selected].href}
        />
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
            href="/streams"
            className={styles.seeAllShowsLink}
          />
        </div>

        <div className={styles.previewsContainer}>
          {streams.map((stream) => (
            <StreamCard key={stream.saleAddress} {...stream} />
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
        <Button
          theme="secondary"
          size="largeWide"
          text="I wanna try"
          href={promoTabs[selected].href}
        />
      </div>
    </main>
  );
};
