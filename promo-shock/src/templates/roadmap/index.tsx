import type { FC } from "react";

import { PHASES_LIST } from "./mocks/fixtures";
import styles from "./roadmap.module.scss";

export const Roadmap: FC = () => {
  return (
    <main className={styles.root}>
      <h1 className={styles.title}>Roadmap</h1>

      <div className={styles.phasesList}>
        <p>
          This document describes the main stages of Donat. Pool development.
          However it is not strictly settled to the current form as business and
          tech requirements may change over time. We will do our best to keep
          the community informed if something is changed for any reason.
        </p>

        {PHASES_LIST.map(({ text, title, status }, i) => (
          <div className={styles.phaseCard} key={i}>
            <h4 className={styles.phaseTitle}>
              {title}{" "}
              {status && (
                <span className={styles.phaseStatus}>{`(${status})`}</span>
              )}
            </h4>

            <ul className={styles.phaseList}>
              {text.map((point) => (
                <li key={point} className={styles.phaseItem}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
};
