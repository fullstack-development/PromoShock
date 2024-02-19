import { pinFIleToIPFS, pinJSONToIPFS } from "@promo-shock/shared/utils/ipfs";

import type { Metadata } from "./types";

const writeMetadata = async (metadata: Metadata) => {
  const imageCID = await pinFIleToIPFS(
    metadata.image,
    { cidVersion: 1 },
    { name: `promo-image.${metadata.image.type}` },
  );
  const metadataCID = await pinJSONToIPFS(
    {
      ...metadata,
      image: `https://ipfs.io/ipfs/${imageCID}`,
      external_link: process.env.NEXT_PUBLIC_METADATA_EXTERNAL_LINK,
    },
    { cidVersion: 1 },
    { name: "promo-metadata.json" },
  );

  return metadataCID;
};

export { writeMetadata };
