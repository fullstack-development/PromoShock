import type { PinataMetadata, PinataOptions } from "@pinata/sdk";

const pinFIleToIPFS = async (
  file: File,
  options?: PinataOptions,
  metadata?: PinataMetadata,
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  if (options) formData.append("pinataOptions", JSON.stringify(options));
  if (metadata) formData.append("pinataMetadata", JSON.stringify(metadata));

  const response = await fetch("/api/pinFileToIPFS", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to pin file to IPFS");

  const data = await response.json();
  return data.IpfsHash;
};

export { pinFIleToIPFS };
