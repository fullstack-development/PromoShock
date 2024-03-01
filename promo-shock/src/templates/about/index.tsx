import classNames from "classnames";
import type { FC } from "react";

import styles from "./about.module.scss";
import { banner } from "./banner";
import { ABOUT_LIST, TEAM_LIST } from "./constants";
import { TeamMember } from "./team-member";

export const About: FC = () => {
  return (
    <main className={styles.root}>
      <h1 className={styles.title}>About</h1>

      <section className={styles.article}>
        <h3 className={styles.h3}>
          Promo<span className={styles.titleAccent}>Shockers!</span>
        </h3>
        <span className={styles.h4}>The squad behind this masterpiece</span>
        <div className={styles.cardList}>
          {TEAM_LIST.map((options, i) => (
            <div
              key={i}
              className={classNames(styles.cardList_item, {
                [styles.cardList_last]: i === TEAM_LIST.length - 1,
              })}
            >
              <TeamMember className={styles.card} {...options} />
              {i === TEAM_LIST.length - 1 && banner}
            </div>
          ))}
        </div>
      </section>

      <section id="reason">
        {ABOUT_LIST.map((item, index) => (
          <div key={index} className={styles.about_list_item}>
            <span className={classNames(styles.about_list_title)}>
              {item.title}
            </span>
            <div className={styles.about_list_content}>{item.content}</div>
          </div>
        ))}
      </section>
    </main>
  );
};
