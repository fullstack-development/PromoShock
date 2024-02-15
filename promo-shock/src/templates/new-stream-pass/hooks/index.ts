import { dagJson } from "@helia/dag-json";
import { useMutation } from "@tanstack/react-query";
import { createHelia } from "helia";

import { useWriteTicketFactoryCreateTicketSale } from "@generated/wagmi";

import type { Metadata } from "../types";

const useCreateStream = () => {
  return useWriteTicketFactoryCreateTicketSale();
};

const useWriteMetadata = () => {
  return useMutation({
    mutationFn: async (metadata: Metadata) => {
      const node = await createHelia();
      const d = dagJson(node);
      const image = await d.add(metadata.image);
      const banner = await d.add(metadata.banner);
      const cid = await d.add({
        ...metadata,
        image: image,
        banner: banner,
        external_link: process.env.NEXT_PUBLIC_METADATA_EXTERNAL_LINK,
      });

      return cid;
    },
  });
};

export { useCreateStream, useWriteMetadata };
