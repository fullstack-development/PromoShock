import styles from "./about.module.scss";

const banner = (
  <div className={styles.banner}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      width="100%"
      height="100%"
      viewBox="0 0 786 441"
    >
      <path
        fill="#9254DE"
        d="M786 411.187V30.49L749.047.558 105.909 2.86v18.53H87.433v11.402h-11.37v286.761H5l71.063 71.267v11.266l11.37 11.403h18.476v15.679H118.7v11.402l638.875-2.303v-11.403h11.37v-15.678H786Z"
      />
      <path
        fill="#FADB14"
        stroke="#141414"
        strokeWidth={4}
        d="M767 393.187V33.794L729.654 3.86H107.475v18.53H88.802v11.403H77.31v281.658H5.492l71.819 71.267v-4.935l11.49 11.403h18.674v15.678h12.927v11.403h617.871v-11.403h11.491v-15.678H767Z"
      />
    </svg>
    <div className={styles.banner_content}>
      <span className={styles.banner_title}>Why DeSoc needs us?</span>
      <p className={styles.banner_description}>
        We&apos;ve got something exciting brewing in the world of tech, and
        it&apos;s all about giving people the benefits they already love.
        Picture this: a dynamic synergy between bloggers, their audience, and
        brands, all working together like a well-oiled machine on social
        networks.
      </p>
    </div>
  </div>
);

export { banner };
