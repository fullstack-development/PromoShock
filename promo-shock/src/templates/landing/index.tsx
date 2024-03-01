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
import quoteImg from "./img/quote.svg";
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
        <div className={styles.description}>
          {promoTabs[selected].description}
        </div>
        <div className={styles.panels}>
          <span className={styles.leftPanel}>
            {promoTabs[selected].panel[0]}
          </span>
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

        <div className={styles.card_title}>
          <TextLink
            title="See all shows"
            underline
            href="/streams?filters=all"
            className={styles.seeAllShowsLink}
          />
        </div>

        <div className={styles.cards}>
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
        <TabList
          selected={selected}
          setSelected={handleSelect}
          tabList={promoTabs}
        />
        <div className={styles.description}>
          {promoTabs[selected].description}
        </div>
        <Button
          theme="secondary"
          size="largeWide"
          text="I wanna try"
          href={promoTabs[selected].href}
        />
      </div>

      <div className={styles.plans}>
        <Image
          className={styles.quoteBackground}
          width={1126}
          height={475}
          src={quoteImg.src}
          alt="background"
        />

        <h3 className={styles.h3}>We do have plans</h3>

        <div className={styles.points}>
          <div>
            To team up with the heavy hitters of streaming—think Twitch, KICK,
            Patreon, or X—and show them why blockchain is the real deal.
          </div>
          <div>
            We&apos;re aiming to charm both brands and streamers, and as for
            PromoShock — we’re gonna make it super user-friendly!
          </div>
          <div>
            To buddy up with DeSoc services gearing up for streaming
            launch—we&apos;ve got their back with any tech support they need.
          </div>
        </div>

        <Button
          theme="tertiary"
          size="small"
          text="Tell me more about PromoShock!"
          href="/about#reason"
          className={styles.readMore}
        />
      </div>
    </main>
  );
};
