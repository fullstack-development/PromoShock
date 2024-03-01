import type { PinataMetadata, PinataOptions } from "@pinata/sdk";

const pinJSONToIPFS = async (
  pinataContent: unknown,
  pinataOptions?: PinataOptions,
  pinataMetadata?: PinataMetadata,
): Promise<string> => {
  const json: {
    pinataContent: unknown;
    pinataOptions?: PinataOptions;
    pinataMetadata?: PinataMetadata;
  } = {
    pinataContent,
  };

  if (pinataOptions) json.pinataOptions = pinataOptions;
  if (pinataMetadata) json.pinataMetadata = pinataMetadata;

  const response = await fetch("/api/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });

  if (!response.ok) throw new Error("Failed to pin JSON to IPFS");

  const data = await response.json();
  return data.IpfsHash;
};

export { pinJSONToIPFS };
