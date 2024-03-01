import type { ComponentProps } from "react";

import styles from "./about.module.scss";
import {
  kirill_image,
  lulllia_image,
  masha_image,
  nico_image,
  oleg_image,
  pavel_image,
  roman_image,
} from "./images";
import type { TeamMember } from "./team-member";

const TEAM_LIST: Array<ComponentProps<typeof TeamMember>> = [
  {
    title: "Kirill",
    description: `Backend maestro who always answers: "Why not? We can do this!"`,
    image: kirill_image,
    link: {
      title: "Twitch",
      href: "",
    },
  },
  {
    title: "Pavel",
    description:
      "Frontend wizard who can bring any designer’s dream to life, for real",
    image: pavel_image,
    link: {
      title: "Linkedin",
      href: "https://www.linkedin.com/in/pavel-shapov-79b3bb251/",
    },
  },
  {
    title: "Oleg",
    description: "Pixel-perfect style warrior who's been through every change",
    image: oleg_image,
    link: {
      title: "GitHub",
      href: "",
    },
  },
  {
    title: "Roman",
    description: "Blockchain guru writing VERY smart contracts",
    image: roman_image,
    link: {
      title: "Linkedin",
      href: "https://www.linkedin.com/in/yarlykovrv",
    },
  },
  {
    title: "Masha",
    description: "UX/UI designer who nails the smooth flow and rocks the style",
    image: masha_image,
    link: {
      title: "Link",
      href: "",
    },
  },
  {
    title: "Julia",
    description: "UX/UI designer with a keen eye for texts and prioritization",
    image: lulllia_image,
    link: {
      title: "Link",
      href: "",
    },
  },
  {
    title: "Nico",
    description:
      "Boss and crypto enthusiast. Faces firing if we don't win the hackathon.",
    image: nico_image,
    link: {
      title: "Link",
      href: "",
    },
  },
];

const ABOUT_LIST = [
  {
    title: "Why the focus on streams, you ask?",
    content: (
      <div className={styles.text_content}>
        <p>
          Well, streams are like live, interactive gems less prone to piracy.
          The real thrill lies in the live experience and real-time interaction
          between streamers and viewers. Unlike static content, leaked streams
          simply can&apos;t replicate that same level of excitement. Plus,
          considering the prevalence of streaming on major social networks like
          X and Facebook, it&apos;s the perfect starting point.
        </p>
        <p>
          Here&apos;s the scoop: streamers can now sell tickets to their streams
          directly on our platform. Take, for instance, a CryptoMonopoly board
          game stream catering to its top 100 fans. Brands can swoop in with
          tailored deals that resonate with this audience&apos;s interests. Each
          ticket being an NFT opens up avenues for targeted promotions, allowing
          streamers to monetize through collaborations and ticket sales, while
          viewers revel in special offers and engaging chats with their favorite
          streamer.
        </p>
        <p>
          But wait, there&apos;s more: even after the stream wraps up, promos
          will continue popping up for viewers, ensuring brands can continually
          engage the same audience with fresh deals. How do viewers snag these
          discounts? It&apos;s simple: stores can cross-reference wallet
          addresses to identify eligible users, thanks to our custom indexer.
          Any store can integrate this feature, attracting users and boosting
          engagement.
        </p>
      </div>
    ),
  },
  {
    title: "And how can users avail discounts on the products?",
    content: (
      <>
        <div className={styles.text_content}>
          <p>
            In essence, we believe that advertisers—those brands we mentioned
            earlier—hold the key to catapulting this DeSoc venture to greatness.
            Armed with innovative ideas and familiar tools, brands can
            seamlessly transition into new realms, whether blockchain-based or
            beyond.
          </p>
          <p>
            Our platform is primed to integrate with any social network offering
            streaming capabilities, be it centralized or decentralized.
          </p>
        </div>
        <div className={styles.disclaimer}>
          All it takes is a sprinkle of blockchain magic and a few hackathon
          victories to set our vision in motion.
        </div>
      </>
    ),
  },
];

export { TEAM_LIST, ABOUT_LIST };
