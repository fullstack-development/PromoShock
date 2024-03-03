import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const POST = async (req: NextRequest) => {
  const json = await req.json();
  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PINATA_API_JWT}`,
      },
      body: JSON.stringify(json),
    },
  );
  if (!response.ok)
    return new Response("Failed to pin JSON to IPFS", { status: 500 });
  const data = await response.json();
  return NextResponse.json(data, { status: 200 });
};

export { POST };
