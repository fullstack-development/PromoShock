import type { FC } from "react";

import { Button, TeamCard } from "@promo-shock/ui-kit";

import styles from "./about.module.scss";
import { TEAM_LIST_MOCK } from "./mocks/fixtures";

export const About: FC = () => {
  return (
    <main className={styles.root}>
      <h1 className={styles.title}>
        About Promo<span className={styles.titleAccent}>Shock</span>
      </h1>

      <article className={styles.article}>
        <h3 className={styles.h3}>We’re Growing and Grooving</h3>
        <p>
          It all started in 2014 as a small programming club. One cold winter
          evening six friends started a company named &quot;Fullstack
          Development&quot;. We looked for challenging projects and stood by one
          another.
          <br />
          Today we are a distributed team that still puts people first.
        </p>
        <Button
          href="https://metalamp.io/"
          text="Visit Metalamp.io"
          theme="tertiary"
          size="medium"
        />
      </article>

      <article className={styles.article}>
        <h3 className={styles.h3Team}>Team</h3>

        <p>
          We are always looking for people who share our vision, approach to
          work and growth.
          <br />
          Want to join us? Write to our Team Master Mikhail about yourself and
          he&apos;ll tell you how to start doing cool things with us.
        </p>

        <div className={styles.cardList}>
          {TEAM_LIST_MOCK.map((options, i) => (
            <TeamCard key={i} {...options} />
          ))}
        </div>
      </article>
    </main>
  );
};
