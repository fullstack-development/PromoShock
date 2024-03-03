import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PINATA_API_JWT}`,
      },
      body: formData,
    },
  );
  if (!response.ok)
    return new Response("Failed to pin file to IPFS", { status: 500 });
  const data = await response.json();
  return NextResponse.json(data, { status: 200 });
};

export { POST };
